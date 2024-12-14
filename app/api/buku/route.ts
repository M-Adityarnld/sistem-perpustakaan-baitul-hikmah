import { buku } from "@/app/class/buku";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const dataBuku = await buku.cariBuku();
    return NextResponse.json(dataBuku, {status : 200});
  } catch (error) {
    return NextResponse.json({ message : "Data buku tidak ditemukan", details : error }, {status : 500});
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dataBuku = await buku.tambahBuku(body)

    return NextResponse.json(dataBuku, {status : 200});
  } catch (error) {

    return NextResponse.json({ message : "Gagal menambahkan data buku", details : error }, {status : 500});
  }
}
