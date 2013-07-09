library(RCurl)
library(RJSONIO)
library(RPostgreSQL)

construct.geocode.url <- function(address, return.call = "json", sensor = "false") {
  root <- "http://maps.google.com/maps/api/geocode/"
  u <- paste(root, return.call, "?address=", address, "&sensor=false", sep = "")
  return(URLencode(u))
}

gGeoCode <- function(address,verbose=FALSE) {
  if(verbose) cat(address,"\n")
  u <- construct.geocode.url(address)
  doc <- getURL(u)
  x <- fromJSON(doc,simplify = FALSE)
  if(x$status=="OK") {
    lat <- x$results[[1]]$geometry$location$lat
    lng <- x$results[[1]]$geometry$location$lng
    return(c(lat, lng))
  } else {
    return(c(NA,NA))
  }
}

limit.head <- 100

con <- dbConnect(PostgreSQL(), user="postgres", password="", dbname="hospital_cluster")
addresses <- dbGetQuery(con, paste("select * from facilities order by id limit ", limit.head, sep=""))

addresses$searchAddress <- paste(paste(addresses$address, addresses$city, addresses$state, sep=", "), addresses$zip, sep=" ")

geocodes <- sapply(addresses$searchAddress, gGeoCode)

addresses$latitude <- geocodes[1,]
addresses$longitude <- geocodes[2,]
addresses$searchAddress <- NULL

write.table(addresses,
            file="~/code-projects/code4health/data/geocoded-addresses.csv",
            na="", sep=",", quote=T, col.names=F, row.names=F)

dbDisconnect(con)