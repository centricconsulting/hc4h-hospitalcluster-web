package models

import anorm._
import play.api.db._
import play.api.Play._

case class Facility(id:Int, name:String, address:String, city:String, state:String, zip:String, latitude:Double, longitude:Double)
case class FacilityRanking(facility:Facility, averageCharges:Double, distance:Double)

object Facilities {
  def findNearestFacilities(latitude:Double, longitude:Double, limit:Int = 20) : Seq[FacilityRanking] = {
    DB.withConnection { implicit connection =>
      SQL("select f.id, name, address, city, state, zip, latitude, longitude, avg(average_covered_charges) as covered_charges, " +
          "ST_Distance(ST_Point({longitude},{latitude}), geo_point)/1000 as distance_km from patient_charges pc join facilities f on pc.facility_id=f.id " +
          "where treatment_id in (280,281,282) group by f.id, f.geo_point order by distance_km asc limit {limit}")
        .on("latitude" -> latitude)
        .on("longitude" -> longitude)
        .on("limit" -> limit)
        .apply()
        .map( row =>
        FacilityRanking(Facility(row[Int]("id"), row[String]("name"), row[String]("address"), row[String]("city"), row[String]("state"), row[String]("zip"),
          row[Double]("latitude"), row[Double]("longitude")), row[Double]("covered_charges"), row[Double]("distance_km"))
      ).toList
    }
  }
}
