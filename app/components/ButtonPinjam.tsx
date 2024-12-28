import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { peminjamType } from "@/lib";
import { toast } from "react-toastify";

interface ButtonPinjamProps {
  session:
    | (Session & { user: { role: "murid" | "guru"; username: string } })
    | null;
  isbn: string;
  judul: string;
}

const ButtonPinjam = ({ session, isbn, judul }: ButtonPinjamProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePinjam = async () => {
    if (!session?.user?.username) {
      toast.error("Anda harus login terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        nis:
          session!.user!.role === "murid" ? session.user.username : undefined,
        nip: session!.user!.role === "guru" ? session.user.username : undefined,
        keterangan: `Peminjaman buku ${judul}`,
        daftarBukuPinjaman: [
          {
            isbn: isbn,
            tenggatWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      } as peminjamType;

      const response = await fetch("/api/peminjaman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = (await response.json()) as any;

      if (!response.ok) {
        throw new Error(
          responseData.details?.message ||
            responseData.message ||
            "Gagal melakukan peminjaman"
        );
      }

      toast.success("Buku berhasil dipinjam!");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Terjadi kesalahan yang tidak diketahui saat meminjam buku"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePinjam}
        disabled={isLoading}
        className={`bg-primary w-full text-white-custom font-source-sans leading-none text-xs rounded-md border-2 border-black-custom py-2 font-normal transition-all duration-300 
          ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:font-bold hover:shadow-sm hover:transition-all hover:duration-300"
          }`}
      >
        {isLoading ? "Memproses..." : "Pinjam"}
      </button>
    </div>
  );
};

export default ButtonPinjam;
