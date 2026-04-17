import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PWD_REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, country, password, invitationCode } = await request.json()

    // ── Required fields ──────────────────────────────────────────
    if (!fullName?.trim())
      return err('Le nom complet est requis.', 'fullName')
    if (!email?.trim())
      return err('L\'adresse email est requise.', 'email')
    if (!password)
      return err('Le mot de passe est requis.', 'password')

    // ── Password strength ────────────────────────────────────────
    if (password.length < 8)
      return err('Le mot de passe doit contenir au moins 8 caractères.', 'password')
    if (!PWD_REGEX.upper.test(password))
      return err('Le mot de passe doit contenir au moins une majuscule.', 'password')
    if (!PWD_REGEX.lower.test(password))
      return err('Le mot de passe doit contenir au moins une minuscule.', 'password')
    if (!PWD_REGEX.number.test(password))
      return err('Le mot de passe doit contenir au moins un chiffre.', 'password')
    if (!PWD_REGEX.special.test(password))
      return err('Le mot de passe doit contenir au moins un caractère spécial (!@#$…).', 'password')

    const admin = createAdminClient()

    // ── Unique full name ─────────────────────────────────────────
    const { data: nameExists } = await admin
      .from('profiles')
      .select('id')
      .ilike('full_name', fullName.trim())
      .maybeSingle()

    if (nameExists)
      return err(
        'Ce nom est déjà utilisé. Ajoutez un deuxième prénom ou une initiale pour vous distinguer.',
        'fullName'
      )

    // ── Unique phone ─────────────────────────────────────────────
    if (phone?.trim()) {
      const { data: phoneExists } = await admin
        .from('profiles')
        .select('id')
        .eq('phone', phone.trim())
        .maybeSingle()

      if (phoneExists)
        return err('Ce numéro de téléphone est déjà associé à un compte.', 'phone')
    }

    // ── Create auth user (bypasses failing triggers) ─────────────
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      user_metadata: {
        full_name: fullName.trim(),
        country_code: country || null,
        phone: phone?.trim() || null,
        invitation_code: invitationCode?.trim() || null,
      },
      email_confirm: false, // sends confirmation email via Supabase
    })

    if (authError) {
      if (
        authError.message.includes('already registered') ||
        authError.message.includes('already been registered') ||
        authError.message.includes('User already registered')
      ) {
        return err('Un compte avec cet email existe déjà.', 'email')
      }
      throw authError
    }

    // ── Upsert profile (handles both trigger-created + manual) ───
    const { error: profileError } = await admin
      .from('profiles')
      .upsert(
        {
          user_id: authData.user.id,
          full_name: fullName.trim(),
          role: 'client',
          phone: phone?.trim() || null,
          country_code: country || null,
        },
        { onConflict: 'user_id', ignoreDuplicates: false }
      )

    if (profileError) {
      console.error('[register] profile upsert error:', profileError)
      // Non-blocking: auth user was created, profile will be created on next login
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé ! Vérifiez votre boîte email pour confirmer votre inscription.',
    })
  } catch (e: unknown) {
    console.error('[api/auth/register]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur serveur inattendue.' },
      { status: 500 }
    )
  }
}

function err(message: string, field: string) {
  return NextResponse.json({ error: message, field }, { status: 400 })
}
