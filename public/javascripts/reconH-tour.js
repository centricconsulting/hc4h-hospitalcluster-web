// First define your tour.
var tour = {
  "id": "recon-hopscotch",
  "steps": [
    {
      "target": "mapContainer",
      "placement": "top",
      "title": "The Map",
      "xOffset": 186,
      "yOffset": 250,
      "delay": 1000,
      "content": "Shows you the hospitals near a centered location which are ranked by Outcomes, Total Average Charges, and Distance clustered by Treatment Groups."
    },
    {
      "target": "sideBar",
      "placement": "right",
      "title": "Toolbar",
      "content": "Use the toolbar to refine your search criteria and watch the map update automatically."
    }
  ]
};

if (!localStorage.getItem('notFirstTime')) {
  localStorage.setItem('notFirstTime', true);

  // Then start the tour.
  hopscotch.startTour(tour);
}
