-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(256),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
