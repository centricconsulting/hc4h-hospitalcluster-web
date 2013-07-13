package helper

import collection.JavaConversions._

import org.apache.commons.math3.ml.clustering._
import org.apache.commons.math3.stat.StatUtils._
import models.FacilityRanking

case class ClusterableFacility(facility:FacilityRanking, var cluster:Int = 0, var weight:Double = 0) extends Clusterable {
  def getPoint: Array[Double] = {Array(facility.averageCharges)}
}

object KMeansClusterer {
  def clusterVals(toCluster:Seq[FacilityRanking], sortParams:Seq[String]) : Seq[ClusterableFacility] = {
    val charges = toCluster.map(_.averageCharges).toArray
    val sd = Math.sqrt(variance(charges))
    val numClusters = Math.floor((max(charges) - min(charges))/sd).toInt

    val clusterer = new KMeansPlusPlusClusterer[ClusterableFacility](numClusters, 10)
    val facilities = toCluster.map(new ClusterableFacility(_))
    val clustered = clusterer.cluster(facilities)
    clustered.map{l =>
      val toSort = l.getPoints
      val weight = sortParams(0) match {
        case "charges" => toSort.map(_.facility.averageCharges).sum / toSort.length;
        case "outcomes" => toSort.map(_.facility.facility.outcomeRank).sum / toSort.length;
        case "distance" => toSort.map(_.facility.distance).sum / toSort.length
        case _ => toSort.map(_.facility.averageCharges).sum / toSort.length;
      }
      l.getPoints.foreach(_.weight = weight)
    }
    var index = 0
    clustered.sortBy(_.getPoints()(0).weight).foreach{lst => index = index+1; lst.getPoints.foreach(_.cluster = index)}

    facilities
  }
}
