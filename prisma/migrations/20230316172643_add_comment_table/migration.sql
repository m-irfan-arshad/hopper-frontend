-- CreateTable
CREATE TABLE "comment" (
    "comment_id" SERIAL NOT NULL,
    "comment_text" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);
