charges <- read.csv("~/code-projects/code4health/data/Medicare_Provider_Charge_Inpatient_DRG100_FY2011.csv",
                   header=T, comment.char="", stringsAsFactors=F)

library(RCurl)
library(RJSONIO)
library(sqldf)

colnames(charges)[4] <- "street_address"
colnames(charges)[5] <- "city"
colnames(charges)[6] <- "state"
colnames(charges)[7] <- "zip"

addresses <- sqldf("select distinct street_address, city, state, zip from charges")

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

geocoded <- data.frame(address=paste(paste(addresses$street_address, addresses$city, addresses$state, sep=", "), addresses$zip, sep=" "))
geocoded <- head(geocoded, n=limit.head)

geo.codes <- sapply(geocoded$address, gGeoCode)

geocoded$latitude <- geo.codes[1,]
geocoded$longitude <- geo.codes[2,]

write.table(geocoded,
            file="~/code-projects/code4health/data/geocoded-addresses.csv",
            na="", sep=",", quote=T, col.names=F, row.names=F)