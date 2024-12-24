SELECT 
    c.id as character_id,
    c.name as character_name,
    p.title as profession_title,
    a.*,
    s.*
FROM Characters c
LEFT JOIN Professions p ON c.profession_id = p.id
LEFT JOIN Attributes a ON c.id = a.character_id
LEFT JOIN Skills s ON c.id = s.character_id
WHERE c.id = 45;