import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, database } from "@/services/firebase";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader, LucideUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";

// Esquema de validação do formulário
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(100, { message: "O nome é muito longo." }),

  email: z
    .string()
    .min(5, { message: "E-mail deve ter pelo menos 5 caracteres." })
    .max(100, { message: "E-mail muito longo." })
    .email({ message: "E-mail inválido." }),

  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres." })
    .max(50, { message: "Senha muito longa." })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula." })
    .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula." })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número." })
    .regex(/[^A-Za-z0-9]/, { message: "Senha deve conter pelo menos um caractere especial." }),

  address: z
    .string()
    .min(5, { message: "O endereço deve ter pelo menos 5 caracteres." })
    .max(200, { message: "O endereço é muito longo." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicId, setPublicId] = useState('');
  
  const router = useRouter();

   const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", address: "" },
  });

  const handleFirebaseSignUp = async (name: string, email: string, password: string, address: string,) => {
    setLoading(true)
    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Salva informações adicionais no Realtime Database
      const imageUrl = publicId ? cld.image(publicId).toURL() : "";

      await set(ref(database, `users/${userCredential.user.uid}`), {
        displayName: name, 
        email: userCredential.user.email,
        address: address,
        role: "user",
        createdAt: new Date().toISOString(),
        photoUrl: imageUrl,
      });

      // Redireciona para a página do usuário após o cadastro
      setLoading(false)
      router.push("/user/userInfo");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("Este e-mail já está em uso.");
            break;
          case "auth/invalid-email":
            setError("E-mail inválido.");
            break;
          case "auth/weak-password":
            setError("Senha muito fraca.");
            break;
          default:
            setError("Erro ao criar conta. Tente novamente.");
        }
      } else {
        setError("Erro desconhecido. Tente novamente.");
      }
      setLoading(false)
    }
  };

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true)
    setError(""); // Limpa erros anteriores
    await handleFirebaseSignUp(data.name, data.email, data.password, data.address);
    form.reset(); // Limpa o formulário após o envio
  };

  return (
    <Form {...form}>
      {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <h1 className="font-bold">Foto de perfil</h1>
        <div className="w-full flex flex-col items-center justify-center gap-4">
        <div
          className="image-previewr"
          style={{ width: '150px', margin: '20px auto rounded-full' }}
        >
          {publicId ? (
          <AdvancedImage
            style={{ maxWidth: '100%', maxHeight: '150px' }}
            cldImg={cld.image(publicId)}
            plugins={[responsive(), placeholder()]}
          />
          ) : (
              <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/50">
                <LucideUserRound />
              </div>
          )}
          </div>
            <CloudinaryUploadWidget
              uwConfig={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                cropping: true, // Habilitar cropping
                croppingAspectRatio: 1, // Proporção de aspecto (opcional)
                croppingDefaultSelectionRatio: 1, // Proporção padrão de seleção (opcional)
                maxImageFileSize: 1500000, // Tamanho máximo do arquivo (1.5MB)
                transformation: [
                  { height: 500, crop: 'limit' }, // Define uma altura máxima de 500px
                ],
              }}
              setPublicId={setPublicId}
            />
          </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="placeholder:text-xs w-full"
                  placeholder="Seu nome completo"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="placeholder:text-xs w-full"
                  placeholder="seu.email@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] w-full opacity-100 transition-opacity duration-300 ease-in-out break-words" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="placeholder:text-xs w-full"
                  placeholder="suasenha123*"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="placeholder:text-xs w-full"
                  placeholder="Rua, número, bairro, cidade..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs min-h-[1rem] opacity-100 transition-opacity duration-300 ease-in-out break-words" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center">
          <Button
            type="submit"
            className="w-1/2 h-10 rounded-md bg-black/30 backdrop-blur-md border border-white/50 text-white shadow-lg flex items-center justify-center hover:bg-black/60 p-4 cursor-pointer"
            onSubmit={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 2000);
              setLoading(false);

            }}
          >
            
            {loading ? <Loader/> : "Fazer Cadastro"}
          </Button>
        </div>

        
      </form>
    </Form>
  );
}