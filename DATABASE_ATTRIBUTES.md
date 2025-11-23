# Activities Table - Database Attributes (Chen's Notation ERD)

1. id (Primary Key)
2. activity_name
3. program_id (Foreign Key)
4. start_date
5. end_date
6. created_at
7. updated_at
8. participants_count
9. male_participants
10. female_participants
11. venue (Composite Attribute - Parent)
    11.1. venue_street
    11.2. venue_barangay
    11.3. venue_city
    11.4. venue_province
12. objectives
13. notes
14. implementing_partners (Multivalued Attribute - Parent)
    14.1. partner_name
    14.2. partner_type
    14.3. partner_nature
15. budget (Composite Attribute - Parent)
    15.1. budget_amount
    15.2. budget_type
16. sdg_number (Multivalued Attribute)
17. phase
18. status
19. created_by (Foreign Key)
