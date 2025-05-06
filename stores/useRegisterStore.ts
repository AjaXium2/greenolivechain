import { create } from "zustand";

type UserRole = "farmer" | "oil_mill" | "recycling_org" | "admin";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  organizationName: string;
  address: string;
  phone: string;
  acceptTerms: boolean;
}

interface RegisterStore {
  formData: FormData;
  step: number;
  errors: Partial<Record<keyof FormData, string>>;
  loading: boolean;
  updateFormField: (field: keyof FormData, value: any) => void;
  validateStep1: () => boolean;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  clearErrors: (field: keyof FormData) => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  formData: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    organizationName: "",
    address: "",
    phone: "",
    acceptTerms: false,
  },
  step: 1,
  errors: {},
  loading: false,
  updateFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  validateStep1: () => {
    const isValid = set((state) => {
      const newErrors: Partial<Record<keyof FormData, string>> = {};

      if (!state.formData.firstName.trim()) {
        newErrors.firstName = "Le prénom est requis";
      }

      if (!state.formData.lastName.trim()) {
        newErrors.lastName = "Le nom est requis";
      }

      if (!state.formData.email) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
        newErrors.email = "Format d'email invalide";
      }

      if (!state.formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (state.formData.password.length < 8) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 8 caractères";
      }

      if (state.formData.password !== state.formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }

      if (!state.formData.role) {
        newErrors.role = "Veuillez sélectionner un rôle";
      }

      set({ errors: newErrors });
      return Object.keys(newErrors).length === 0;
    });
    return isValid;
  },
  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  clearErrors: (field) =>
    set((state) => ({
      errors: { ...state.errors, [field]: "" },
    })),
}));
