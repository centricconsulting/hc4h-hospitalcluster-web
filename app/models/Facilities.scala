package models

import anorm._
import play.api.db._
import play.api.Play._

case class Facility(name:String, address:String, city:String, state:String, zip:String)
case class FacilityDistance(facility:Facility, kilometers:Double)

object Facilities {
  def findNearestFacilities(latitude:Double, longitude:Double, limit:Int = 20) : Seq[FacilityDistance] = {
    DB.withConnection { implicit connection =>
      SQL("select name, ST_Distance(ST_Point({longitude}, {latitude}), geo_point)/1000 as distance_km from facilities order by distance_km asc limit {limit}")
        .on("latitude" -> latitude)
        .on("longitude" -> longitude)
        .on("limit" -> limit)
        .apply()
        .map( row =>
        FacilityDistance(Facility(row[String]("name"), row[String]("address"), row[String]("city"), row[String]("state"), row[String]("zip")),
          row[Double]("distance_km"))
      ).toList
    }
  }
}
