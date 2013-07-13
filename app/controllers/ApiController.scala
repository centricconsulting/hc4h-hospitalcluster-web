package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

import models.{Facilities, Treatments}
import helper.{ClusterableFacility, KMeansClusterer}

object ApiController extends Controller {
  def listTreatments = Action {
    val fTreatments = scala.concurrent.Future { Treatments.findAllTreatments }
    val fTimeout = play.api.libs.concurrent.Promise.timeout("Backend timeout", 2.seconds)
    Async {
      Future.firstCompletedOf(Seq(fTreatments, fTimeout)).map {
        case l: Seq[String] => Ok(toJson(l))
        case s: String => InternalServerError(s)
      }
    }
  }

  def findFacilitiesByGeography(latitude:Double, longitude:Double) = Action {
    val fResult = scala.concurrent.Future { KMeansClusterer.clusterVals(Facilities.findNearestFacilities(latitude, longitude)) }
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
                    "address" -> f.facility.facility.address,
                    "city" -> f.facility.facility.city,
                    "state" -> f.facility.facility.state,
                    "zip" -> f.facility.facility.zip,
                    "lat" -> f.facility.facility.latitude.toString,
                    "lon" -> f.facility.facility.longitude.toString,
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
