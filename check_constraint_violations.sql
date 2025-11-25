-- Script untuk mengecek pelanggaran constraint sebelum migration
-- Run dengan: psql -U your_user -d your_database -f check_constraint_violations.sql

-- ============================================
-- 1. CEK: USERS → ALUMNIS (1:1) VIOLATION
-- ============================================
-- Cek apakah ada user_id yang muncul lebih dari sekali di tabel alumnis
-- (Ini akan melanggar unique constraint yang akan kita tambahkan)

SELECT 
    'ALUMNI 1:1 VIOLATION' as check_type,
    user_id,
    COUNT(*) as violation_count,
    ARRAY_AGG(id) as alumni_ids,
    ARRAY_AGG(name) as alumni_names
FROM alumnis
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) > 1;

-- ============================================
-- 2. CEK: ALUMNI_SKILL COMPOSITE KEY VIOLATION
-- ============================================
-- Cek apakah ada kombinasi alumni_id + skill_id yang duplikat
-- (Ini akan melanggar composite primary key yang akan kita buat)

SELECT 
    'ALUMNI_SKILL DUPLICATE' as check_type,
    alumni_id,
    skill_id,
    COUNT(*) as violation_count,
    ARRAY_AGG(id) as record_ids
FROM alumni_skill
GROUP BY alumni_id, skill_id
HAVING COUNT(*) > 1;

-- ============================================
-- 3. CEK: ALUMNI_SKILL dengan ID column (jika masih ada)
-- ============================================
-- Cek struktur tabel alumni_skill saat ini

SELECT 
    'ALUMNI_SKILL STRUCTURE CHECK' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'alumni_skill'
ORDER BY ordinal_position;

-- ============================================
-- 4. SUMMARY: Total records yang perlu di-cleanup
-- ============================================

SELECT 
    'SUMMARY' as check_type,
    (SELECT COUNT(*) FROM (
        SELECT user_id
        FROM alumnis
        WHERE user_id IS NOT NULL
        GROUP BY user_id
        HAVING COUNT(*) > 1
    ) as violations) as alumni_1to1_violations,
    (SELECT COUNT(*) FROM (
        SELECT alumni_id, skill_id
        FROM alumni_skill
        GROUP BY alumni_id, skill_id
        HAVING COUNT(*) > 1
    ) as violations) as alumni_skill_duplicates;

