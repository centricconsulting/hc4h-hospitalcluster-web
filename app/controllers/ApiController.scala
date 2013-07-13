package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

import models.{Facilities, TreatmentGroup, Treatments}
import helper.{ClusterableFacility, KMeansClusterer}

object ApiController extends Controller {
  def listTreatmentGroups = Action {
    val fTreatments = scala.concurrent.Future { Treatments.findAllTreatments }
    val fTimeout = play.api.libs.concurrent.Promise.timeout("Backend timeout", 2.seconds)
    Async {
      Future.firstCompletedOf(Seq(fTreatments, fTimeout)).map {
        case l: Seq[TreatmentGroup] => Ok(
          toJson(
            Map(
              "treatments" -> l.map{ t =>
                toJson(
                  Map(
                    "id" -> t.id.toString,
                    "description" -> t.description
                  )
                )
              }
            )
          )
        )
        case s: String => InternalServerError(s)
      }
    }
  }

  def findFacilitiesByGeographyAndTreatmentGroup(latitude:Double, longitude:Double, treatmentGroupId:Int, sort:String) = Action { request =>
    val sortParams = sort.split(",")
    val fResult = scala.concurrent.Future { KMeansClusterer.clusterVals(Facilities.findNearestFacilities(latitude, longitude, treatmentGroupId), sortParams) }
    val fTimeout = play.api.libs.concurrent.Promise.timeout("Backend timeout", 2.seconds)
    Async {
      Future.firstCompletedOf(Seq(fResult, fTimeout)).map {
        case l: Seq[ClusterableFacility] => Ok(
          toJson(
            Map(
              "facilities" -> l.map{ f =>
                toJson(
                  Map(
                    "distance" -> f.facility.distance.toString,
                    "charges" -> f.facility.averageCharges.toString,
                    "name" -> f.facility.facility.name,
                    "address" -> f.facility.facility.address,
                    "city" -> f.facility.facility.city,
                    "state" -> f.facility.facility.state,
                    "zip" -> f.facility.facility.zip,
                    "latitude" -> f.facility.facility.latitude.toString,
                    "longitude" -> f.facility.facility.longitude.toString,
                    "outcomeRank" -> f.facility.facility.outcomeRank.toString,
                    "cluster" -> f.cluster.toString
                  )
                )
              }
            )
          )
        )
        case s: String => InternalServerError(s)
      }
    }
  }
}
