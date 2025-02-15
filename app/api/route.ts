import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import {
  bukuType,
  kelasType,
  keteranganType,
  guruType,
  muridType,
  peminjamanType,
  perbaruiAnggotaType,
  perbaruiKelasType,
  Genre,
  userType,
} from "@/lib";

import { Buku } from "@/app/class/buku";
import { Keterangan } from "@/app/class/keterangan";
import { Kelas } from "@/app/class/kelas";
import { Guru } from "@/app/class/guru";
import { FormBukti } from "@/app/class/formbukti";
import { Murid } from "@/app/class/murid";
import { Peminjaman } from "@/app/class/peminjaman";
import { seeds } from "@/seeds";
import { prisma } from "@/lib";
import { JenisKelamin } from "@prisma/client";
import { RiwayatKelas } from "../class/riwayatkelas";
import { Penulis } from "../class/penulis";
import { Penerbit } from "../class/penerbit";
import { Sumbangan } from "../class/sumbangan";
import { PembayaranTunai } from "../class/pembayarantunai";
import { RiwayatBantuan } from "../class/riwayatbantuan";
import { User } from "../class/user";

export async function GET() {
  const {
    buku: dataBuku,
    kelas: dataKelas,
    murid: dataMurid,
    guru: dataGuru,
    keterangan: dataKeterangan,
    peminjaman: dataPeminjaman,
    formBukti: dataFormBukti,
    eksemplarBuku: dataEksemplarBuku,
    user: dataUser,
    petugasPerpustakaan: dataPetugasPerpustakaan,
  } = seeds;

  await prisma.riwayatBantuan.deleteMany({});
  await prisma.pembayaranTunai.deleteMany({});
  await prisma.denda.deleteMany({});
  await prisma.sumbangan.deleteMany({});
  await Keterangan.hapusSemuaKeterangan();
  await FormBukti.hapusSemuaDataFormBukti();
  await Murid.hapusSemuaAnggota();
  await Guru.hapusSemuaAnggota();
  await RiwayatKelas.hapusSemuaRiwayatKelas();
  // await prisma.sumbangan.deleteMany({})

  await Kelas.hapusSemuaKelas();
  // await prisma.penulis.deleteMany({})
  // await prisma.penerbit.deleteMany({})
  await Peminjaman.hapusSemuaPeminjaman();
  await Buku.hapusSemuaBuku();

  await Buku.tambahBanyakBuku(dataBuku);
  await Kelas.tambahBanyakKelas(dataKelas);
  await Murid.tambahBanyakAnggota(dataMurid);
  await Guru.tambahBanyakAnggota(dataGuru);
  await Keterangan.tambahBanyakKeterangan(dataKeterangan);

  // await FormBukti.tambahDataFormBukti(dataFormBukti[0]);
  // await FormBukti.tambahDataFormBukti(dataFormBukti[1]);
  // await FormBukti.tambahDataFormBukti(dataFormBukti[2]);

  for await (const data of dataPeminjaman)
    await Peminjaman.tambahPeminjaman(data);

  await prisma.petugasPerpustakaan.deleteMany({});

  await prisma.petugasPerpustakaan.createMany({
    data: dataPetugasPerpustakaan,
  });

  await test(dataUser);

  await prisma.sumbangan.createMany({
    data: [
      {
        id: 1000,
        nis: "12250111794",
        idKeterangan: 2,
        tanggalSelesai: new Date(),
        berlebih: true,
      },
      {
        id: 1001,
        nis: "12250111048",
        idKeterangan: 4,
      },
      {
        id: 1002,
        nis: "12250111791",
        idKeterangan: 4,
      },
      {
        id: 1003,
        nis: "12250111794",
        idKeterangan: 4,
      },
      {
        id: 1004,
        nis: "12250111794",
        idKeterangan: 4,
      },
    ],
  });

  await prisma.denda.create({
    data: {
      id: 10000,
      idSumbangan: 1000,
      tanggal: new Date(),
    },
  });

  await prisma.eksemplarBuku.createMany({
    data: dataEksemplarBuku,
  });

  await prisma.pembayaranTunai.createMany({
    data: [
      {
        id: 3000,
        tanggal: new Date(Date.now()),
        jumlah: 50000,
        idSumbangan: 1000,
      },
    ],
  });

  // await prisma.riwayatBantuan.createMany({
  //   data: [
  //     { idPembayaranTunai: 3003, idSumbangan: 1000, jumlah: 50000 },
  //     { idPembayaranTunai: 3004, idSumbangan: 1000, jumlah: 50000 },
  //     { idPembayaranTunai: 3005, idSumbangan: 1000, jumlah: 50000 },
  //   ],
  // });

  // const test = await Sumbangan.cariSumbangan({nis : "12250111794"});

  // const a = await PembayaranTunai.totalkanPembayaranTunai(test[0].id);
  //             const b = await RiwayatBantuan.totalkanRiwayatBantuan(test[0].id);
  //             const c = a + b;
  //             console.log(a);
  //             console.log(b);
  //             console.log(c);

  const arrayBuku: bukuType[] = (await Buku.ambilSemuaDataBuku()) as bukuType[];
  const arrayKelas: kelasType[] =
    (await Kelas.ambilSemuaDataKelas()) as kelasType[];
  const arrayMurid: muridType[] =
    (await Murid.ambilSemuDataMurid()) as muridType[];
  const arrayKeterangan: keteranganType[] =
    (await Keterangan.ambilSemuaDataKeterangan()) as keteranganType[];
  const arrayGuru: guruType[] = (await Guru.ambilSemuaDataGuru()) as guruType[];
  const arrayPeminjaman: peminjamanType[] =
    (await Peminjaman.ambilSemuaDataPeminjaman()) as peminjamanType[];
  const arrayPenulis = await Penulis.ambilSemuaDataPenulis();
  const arrayPenerbit = await Penerbit.ambilSemuaDataPenerbit();
  const arrayBukuPinjaman = await prisma.bukuPinjaman.findMany({});
  const arrayDenda = await prisma.denda.findMany({});
  const arrayDataFormBukti = await FormBukti.ambilSemuaDataFormBukti();
  const arrayEksemplarBuku = await prisma.eksemplarBuku.findMany({});
  const arraySumbangan = await prisma.sumbangan.findMany({});

  return NextResponse.json({
    // test,
    arraySumbangan,
    arrayEksemplarBuku,
    arrayDataFormBukti,
    arrayBuku,
    arrayKelas,
    arrayMurid,
    arrayKeterangan,
    arrayGuru,
    arrayPeminjaman,
    arrayPenulis,
    arrayPenerbit,
    arrayBukuPinjaman,
    arrayDenda,
  });
}

async function test(dataUser: userType[]): Promise<void> {
  await prisma.user.deleteMany({});

  for await (const user of dataUser) {
    const {
      username,
      password,
      role,
      muridNIS,
      guruNIP,
      petugasPerpustakaanId,
    } = user;
    const dataUser = new User({
      username,
      password,
      role,
      muridNIS,
      guruNIP,
      petugasPerpustakaanId,
    });

    await User.tambahUser(dataUser);

    // console.log(data);
  }
}
