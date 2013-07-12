package helper

import models.FacilityRanking

import collection.JavaConversions._

import org.apache.commons.math3.ml.clustering.{Clusterable, DoublePoint, KMeansPlusPlusClusterer}
import org.apache.commons.math3.ml.clustering.KMeansPlusPlusClusterer
import org.apache.commons.math3.stat.StatUtils._

case class ClusterableFacility(facility:FacilityRanking, var cluster:Int = 0) extends Clusterable {
  def getPoint: Array[Double] = {Array(facility.averageCharges)}
}

object KMeansClusterer {
  def clusterVals(toCluster:Seq[FacilityRanking]) : Seq[ClusterableFacility] = {
    val charges = toCluster.map(_.averageCharges).toArray
    val sd = Math.sqrt(variance(charges))
    val numClusters = Math.floor((max(charges) - min(charges))/sd).toInt

    val clusterer = new KMeansPlusPlusClusterer[ClusterableFacility](numClusters, 10)
    clusterer.cluster(toCluster.map(new ClusterableFacility(_)).toIterable).flatMap(_.getPoints).toSeq
  }
}
