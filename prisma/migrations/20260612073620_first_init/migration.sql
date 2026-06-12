-- CreateEnum
CREATE TYPE "RolesEnum" AS ENUM ('Admin', 'Client');

-- CreateEnum
CREATE TYPE "DiscTypeEnum" AS ENUM ('Amount', 'Percent');

-- CreateEnum
CREATE TYPE "EventStatusEnum" AS ENUM ('PENDING', 'NOT_PAID', 'ACTIVE', 'CANCELED', 'ENDED');

-- CreateEnum
CREATE TYPE "TradRecepType" AS ENUM ('Traditional', 'Reception');

-- CreateEnum
CREATE TYPE "ScheduleEnum" AS ENUM ('WED_MB', 'WED_TOR', 'WED_CST');

-- CreateEnum
CREATE TYPE "GroomBrideEnum" AS ENUM ('Groom', 'Bride');

-- CreateEnum
CREATE TYPE "EventGiftTypeEnum" AS ENUM ('Transfer', 'Wishlist');

-- CreateEnum
CREATE TYPE "RsvpStatusEnum" AS ENUM ('PRESENCE', 'ABSENCE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "role" "RolesEnum" NOT NULL DEFAULT 'Client',
    "name" TEXT,
    "no_phone" TEXT,
    "gender" TEXT,
    "birth_date" TIMESTAMP(3),
    "birth_place" TEXT,
    "point" INTEGER DEFAULT 0,
    "image" TEXT,
    "image_name" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "usingAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "usingAt" TIMESTAMP(3),

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Templates" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "disc_price" INTEGER,
    "short_desc" TEXT,
    "desc" TEXT,
    "ctg_key" TEXT,
    "ctg_name" TEXT,
    "url" TEXT NOT NULL,
    "flag_name" TEXT,
    "flag_color" TEXT,
    "colors" TEXT,
    "language" TEXT,
    "layouts" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "rate_1_count" INTEGER DEFAULT 0,
    "rate_2_count" INTEGER DEFAULT 0,
    "rate_3_count" INTEGER DEFAULT 0,
    "rate_4_count" INTEGER DEFAULT 0,
    "rate_5_count" INTEGER DEFAULT 0,
    "sold" BIGINT DEFAULT 0,
    "rate_count" INTEGER DEFAULT 0,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateCaptures" (
    "id" SERIAL NOT NULL,
    "tmp_id" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "TemplateCaptures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vouchers" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "disc_type" "DiscTypeEnum" NOT NULL,
    "disc_amount" INTEGER NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "is_one_use" BOOLEAN NOT NULL,
    "desc" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tmp_id" INTEGER NOT NULL,
    "tmp_status" "EventStatusEnum" NOT NULL,
    "tmp_code" TEXT NOT NULL,
    "tmp_ctg" TEXT NOT NULL,
    "tmp_ctg_key" TEXT NOT NULL,
    "duration" INTEGER,
    "duration_date" TIMESTAMP(3),
    "greeting_msg" TEXT,
    "couple_img_name" TEXT,
    "couple_img_path" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "music_url" TEXT,
    "custom_music_url" TEXT,
    "custom_music_r2" TEXT,
    "custom_music_name" TEXT,
    "youtube_url" TEXT,
    "schedule_note" TEXT,
    "wishlist_address" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tr" (
    "tr_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "pay_token" TEXT,
    "pay_redirect_url" TEXT,
    "pay_type" TEXT,
    "pay_acquirer" TEXT,
    "pay_key" TEXT,
    "pay_status" BOOLEAN NOT NULL DEFAULT false,
    "pay_at" TIMESTAMP(3),
    "pay_va" TEXT,
    "pay_expiry_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pay_bill_key" TEXT,
    "pay_bill_code" TEXT,
    "qris_url" TEXT,
    "subtotal" INTEGER NOT NULL,
    "duration_amount" INTEGER NOT NULL,
    "voucher_code" TEXT,
    "voucher_slug" TEXT,
    "voucher_type" "DiscTypeEnum",
    "voucher_amount" INTEGER,
    "total_amount" INTEGER NOT NULL,

    CONSTRAINT "Tr_pkey" PRIMARY KEY ("tr_id")
);

-- CreateTable
CREATE TABLE "GroomBrideInfo" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "type" "GroomBrideEnum" NOT NULL,
    "fullname" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "birth_place" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "birth_order" INTEGER NOT NULL,
    "father_name" TEXT,
    "mother_name" TEXT,
    "place_origin" TEXT,
    "occupation" TEXT,
    "personal_msg" TEXT,
    "img_name" TEXT,
    "img_path" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GroomBrideInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleInfo" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "type" "ScheduleEnum" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT,
    "location" TEXT,
    "address" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "notes" TEXT[],
    "ceremony_type" "TradRecepType",
    "youtube_url" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ScheduleInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventGalleries" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "img_name" TEXT,
    "img_path" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventGalleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventHistories" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "desc" TEXT,
    "gallery_id" INTEGER,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventHistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventGifts" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "type" "EventGiftTypeEnum" NOT NULL,
    "name" TEXT NOT NULL,
    "account" TEXT,
    "no_rek" TEXT,
    "product_url" TEXT,
    "product_price" INTEGER,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "reserve_qty" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventGifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFAQ" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRsvp" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "att_status" "RsvpStatusEnum",
    "att_number" INTEGER,
    "barcode" TEXT,
    "desc" TEXT,
    "show_desc" BOOLEAN NOT NULL DEFAULT false,
    "is_present" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistReservation" (
    "id" SERIAL NOT NULL,
    "gift_id" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "reserve_qty" INTEGER NOT NULL,
    "name" TEXT,
    "email_or_wa" TEXT,
    "message" TEXT,

    CONSTRAINT "WishlistReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userId_key" ON "VerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Templates_slug_key" ON "Templates"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vouchers_slug_key" ON "Vouchers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vouchers_code_key" ON "Vouchers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Events_tmp_code_key" ON "Events"("tmp_code");

-- CreateIndex
CREATE UNIQUE INDEX "Tr_event_id_key" ON "Tr"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventRsvp_barcode_key" ON "EventRsvp"("barcode");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateCaptures" ADD CONSTRAINT "TemplateCaptures_tmp_id_fkey" FOREIGN KEY ("tmp_id") REFERENCES "Templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_tmp_id_fkey" FOREIGN KEY ("tmp_id") REFERENCES "Templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tr" ADD CONSTRAINT "Tr_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tr" ADD CONSTRAINT "Tr_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomBrideInfo" ADD CONSTRAINT "GroomBrideInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleInfo" ADD CONSTRAINT "ScheduleInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGalleries" ADD CONSTRAINT "EventGalleries_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHistories" ADD CONSTRAINT "EventHistories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHistories" ADD CONSTRAINT "EventHistories_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "EventGalleries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGifts" ADD CONSTRAINT "EventGifts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFAQ" ADD CONSTRAINT "EventFAQ_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistReservation" ADD CONSTRAINT "WishlistReservation_gift_id_fkey" FOREIGN KEY ("gift_id") REFERENCES "EventGifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
