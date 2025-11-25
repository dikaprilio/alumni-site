-- Script untuk FIX pelanggaran constraint
-- ⚠️ BACKUP DATABASE TERLEBIH DAHULU sebelum run script ini!
-- Run dengan: psql -U your_user -d your_database -f fix_constraint_violations.sql

-- ============================================
-- FIX 1: USERS → ALUMNIS (1:1) VIOLATION
-- ============================================
-- Strategy: Untuk user yang punya multiple alumni records,
-- kita akan keep yang pertama (terlama) dan set user_id = NULL untuk yang lain

BEGIN;

-- Step 1: Identifikasi duplikat
CREATE TEMP TABLE alumni_duplicates AS
SELECT 
    user_id,
    id as alumni_id,
    name,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as rn
FROM alumnis
WHERE user_id IS NOT NULL
    AND user_id IN (
        SELECT user_id
        FROM alumnis
        WHERE user_id IS NOT NULL
        GROUP BY user_id
        HAVING COUNT(*) > 1
    );

-- Step 2: Set user_id = NULL untuk duplikat (keep yang pertama)
UPDATE alumnis
SET user_id = NULL
WHERE id IN (
    SELECT alumni_id 
    FROM alumni_duplicates 
    WHERE rn > 1
);

-- Step 3: Log hasil
SELECT 
    'FIXED: Alumni 1:1 violations' as action,
    COUNT(*) as records_fixed
FROM alumni_duplicates
WHERE rn > 1;

DROP TABLE alumni_duplicates;

-- ============================================
-- FIX 2: ALUMNI_SKILL COMPOSITE KEY VIOLATION
-- ============================================
-- Strategy: Hapus duplikat, keep yang pertama (terlama berdasarkan id jika ada)

-- Step 1: Identifikasi duplikat
CREATE TEMP TABLE skill_duplicates AS
SELECT 
    alumni_id,
    skill_id,
    id,
    ROW_NUMBER() OVER (PARTITION BY alumni_id, skill_id ORDER BY id ASC) as rn
FROM alumni_skill
WHERE (alumni_id, skill_id) IN (
    SELECT alumni_id, skill_id
    FROM alumni_skill
    GROUP BY alumni_id, skill_id
    HAVING COUNT(*) > 1
);

-- Step 2: Hapus duplikat (keep yang pertama)
DELETE FROM alumni_skill
WHERE id IN (
    SELECT id 
    FROM skill_duplicates 
    WHERE rn > 1
);

-- Step 3: Log hasil
SELECT 
    'FIXED: Alumni_Skill duplicates' as action,
    COUNT(*) as records_deleted
FROM skill_duplicates
WHERE rn > 1;

DROP TABLE skill_duplicates;

-- ============================================
-- VERIFY: Pastikan tidak ada lagi violation
-- ============================================

-- Cek alumni 1:1
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ No violations found'
        ELSE '❌ Still has violations: ' || COUNT(*)::text
    END as alumni_1to1_status
FROM (
    SELECT user_id
    FROM alumnis
    WHERE user_id IS NOT NULL
    GROUP BY user_id
    HAVING COUNT(*) > 1
) as violations;

-- Cek alumni_skill duplicates
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ No duplicates found'
        ELSE '❌ Still has duplicates: ' || COUNT(*)::text
    END as alumni_skill_status
FROM (
    SELECT alumni_id, skill_id
    FROM alumni_skill
    GROUP BY alumni_id, skill_id
    HAVING COUNT(*) > 1
) as duplicates;

COMMIT;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Script ini akan:
--    - Set user_id = NULL untuk alumni duplikat (keep yang pertama)
--    - Hapus duplikat di alumni_skill (keep yang pertama)
--
-- 2. Setelah run script ini, pastikan:
--    - Tidak ada lagi violation (cek dengan check_constraint_violations.sql)
--    - Data masih konsisten
--
-- 3. Jika ada alumni yang user_id di-set NULL, mereka perlu di-link manual
--    atau dibuatkan user account baru

