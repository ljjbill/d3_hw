

// Set the width and height of the containing box
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 4;

// Set the spacing margin
var margin = 20;

// Set the spacing to put the label words
var labelArea = 110;

// padding for the text at the bottom and left axes
var PaddingBottom = 40;
var PaddingLeft = 40;

// Create the svg area
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot that will appear in the graph.

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Bottom labels
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

// Function to adjust the position of the label as window width changes
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - PaddingBottom) +
      ")"
  );
}
xTextRefresh();

// Append text for label In Poverty rate
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// Append text for label age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// Append text for label household income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// Y axis labels

// set y axis label position
var leftTextX = margin + PaddingLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Set a group for the y axis label
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

// Rotate the label by 90 degrees
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Append text for label obese rate
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// Append text for label smoke rate
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// Append text for label lacks healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// import csv file
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

// visualize function to set the default data on x-axis and y-axis
function visualize(theData) {
  var curX = "poverty";
  var curY = "obesity";

  // Set empty variables for the min and max values of x and y.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Set tooltip rules.
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      console.log(d)
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return theState + theX + theY;
    });

  svg.call(toolTip);

  // change the min and max for x
  function xMinMax() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // change the min and max for y
  function yMinMax() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // change label text when clicked
  function labelChange(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    clickedText.classed("inactive", false).classed("active", true);
  }


  // Get the min and max values of x and y.
  xMinMax();
  yMinMax();

  // Set xScale and yScale based on the min and max of x and y
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // set tick count based on the width of window
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // Set the positon of axis
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Set the group of circles
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each state
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // set rules when hover on the dots
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Put state abbreviation in the middle of the circle
  theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    // set the position based on scale
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // push the text to the middle
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules for tooltip
    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // Click Actions on labels

  // Select all axis text on the event, toggle inactive to active, vice versa
  d3.selectAll(".aText").on("click", function() {
 
    var self = d3.select(this);

    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");
      if (axis === "x") {
        curX = name;
        xMinMax();
        xScale.domain([xMin, xMax]);
        svg.select(".xAxis").transition().duration(300).call(xAxis);
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
        curY = name;
        yMinMax();
        yScale.domain([yMin, yMax]);
        svg.select(".yAxis").transition().duration(300).call(yAxis);
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

    
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });
        labelChange(axis, self);
      }
    }
  });

  // Change layout when window size is changed
  d3.select(window).on("resize", resize);



  function resize() {
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    svg.attr("width", width).attr("height", height);


    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);


    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    tickCount();

  
    xTextRefresh();
    yTextRefresh();

   
    crGet();


    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}

