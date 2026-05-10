function publicText(value: string | undefined, fallback = ""): string {
  return value?.trim() || fallback;
}

export const PUBLIC_ENV = {
  appName: publicText(process.env.NEXT_PUBLIC_APP_NAME, "Frozeria Stok"),
  appVersion: publicText(process.env.NEXT_PUBLIC_APP_VERSION, "0.9.0"),
  participant: {
    name: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_NAME, "Belum diisi"),
    studentId: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_STUDENT_ID, "Belum diisi"),
    className: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_CLASS, "Belum diisi"),
    address: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_ADDRESS, "Belum diisi"),
    phone: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_PHONE, "Belum diisi"),
    email: publicText(process.env.NEXT_PUBLIC_PARTICIPANT_EMAIL, "Belum diisi"),
  },
} as const;
