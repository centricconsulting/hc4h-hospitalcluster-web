library(RPostgreSQL)
library(ggplot2)

con <- dbConnect(PostgreSQL(), user="wwwrun", password="", dbname="hospital_cluster")
# Clustering of hospitals that treat myocardial infarctions near Technicolor office
facilities <- dbGetQuery(con,
  "select f.id, name, address, city, state, zip, latitude, longitude, avg(average_covered_charges) as covered_charges, ST_Distance(ST_Point(-86.162492,39.934969), geo_point)/1000 as distance_km from patient_charges pc join facilities f on pc.facility_id=f.id where treatment_id in (280,281,282) group by f.id, f.geo_point order by distance_km asc limit 20")

cluster <- data.frame(distance=facilities$distance_km, charges=facilities$covered_charges)
row.names(cluster) <- facilities$id
fit <- kmeans(cluster, floor((max(cluster$charges)-min(cluster$charges))/sd(cluster$charges)))
cluster <- data.frame(cluster, cluster=factor(fit$cluster))

print(qplot(distance, charges, data=cluster, colour=cluster, size=I(6)))

dbDisconnect(con)