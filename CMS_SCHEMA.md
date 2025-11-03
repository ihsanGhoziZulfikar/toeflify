# Dokumentasi Skema Konten Sanity

Struktur utamanya:

- **`section`** (Dokumen): Kontainer level tertinggi (misal: "Structure, Weiring, Reading").
  - **`chapter`** (Objek): Bagian di dalam `section` (misal: "Structure Questions, Writen expression").
    - **`topicGroup`** (Objek): Grup topik di dalam `chapter`.
      - **`skill`** (Objek): Unit konten terkecil yang spesifik .

---

## Tipe Dokumen: `section`

| Nama Field    | Tipe Data                | Deskripsi                                                       |
| :------------ | :----------------------- | :-------------------------------------------------------------- |
| `name`        | `string`                 | Nama dari section (Wajib diisi).                                |
| `coverImage`  | `image`                  | Gambar sampul untuk section.                                    |
| `slug`        | `slug`                   | URL slug yang unik, dibuat otomatis dari `name` (Wajib diisi).  |
| `order`       | `number`                 | Nomor urut untuk section (Wajib diisi, bilangan bulat positif). |
| `description` | `array` (dari `block`)   | Deskripsi rich text untuk section.                              |
| `chapters`    | `array` (dari `chapter`) | Kumpulan `chapter` yang berada di dalam section ini.            |

---

## Tipe Objek: `chapter`

| Nama Field    | Tipe Data                   | Deskripsi                                                                   |
| :------------ | :-------------------------- | :-------------------------------------------------------------------------- |
| `name`        | `string`                    | Nama dari chapter.                                                          |
| `slug`        | `slug`                      | URL slug yang unik, dibuat otomatis dari `name` parent atau `name` chapter. |
| `coverImage`  | `image`                     | Gambar sampul untuk chapter.                                                |
| `order`       | `number`                    | Nomor urut untuk chapter (Wajib diisi, bilangan bulat positif).             |
| `description` | `array` (dari `block`)      | Deskripsi rich text untuk chapter.                                          |
| `topicGroups` | `array` (dari `topicGroup`) | Kumpulan `topicGroup` yang berada di dalam chapter ini.                     |

---

## Tipe Objek: `topicGroup`

| Nama Field    | Tipe Data              | Deskripsi                                                                |
| :------------ | :--------------------- | :----------------------------------------------------------------------- |
| `name`        | `string`               | Nama dari grup topik.                                                    |
| `slug`        | `slug`                 | URL slug yang unik, dibuat otomatis dari `name` parent atau `name` grup. |
| `coverImage`  | `image`                | Gambar sampul untuk grup topik.                                          |
| `description` | `array` (dari `block`) | Deskripsi rich text untuk grup topik.                                    |
| `skills`      | `array` (dari `skill`) | Kumpulan `skill` yang berada di dalam grup topik ini.                    |

---

## Tipe Objek: `skill`

| Nama Field    | Tipe Data | Deskripsi                                                                       |
| :------------ | :-------- | :------------------------------------------------------------------------------ |
| `name`        | `string`  | Nama dari skill.                                                                |
| `slug`        | `slug`    | URL slug yang unik, dibuat otomatis dari `name` parent atau `name` skill.       |
| `coverImage`  | `image`   | Gambar sampul untuk skill.                                                      |
| `order`       | `number`  | Nomor urut untuk skill (Wajib diisi, bilangan bulat positif).                   |
| `description` | `text`    | Deskripsi singkat (plain text) untuk skill.                                     |
| `content`     | `array`   | Konten utama skill. Dapat berisi `block` (rich text) dan `customTable`.         |
| `exercise`    | `array`   | Konten latihan untuk skill. Dapat berisi `block` (rich text) dan `customTable`. |

---

## Tipe Objek: `customTable`

| Nama Field | Tipe Data | Deskripsi                                                      |
| :--------- | :-------- | :------------------------------------------------------------- |
| `table`    | `table`   | Data tabel itu sendiri (menggunakan tipe `table` dari plugin). |
| `caption`  | `string`  | Caption atau deskripsi aksesibilitas untuk tabel.              |

---
