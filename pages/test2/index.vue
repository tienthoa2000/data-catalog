<template>
  <!-- <div id="chart" style="margin: 100px 0 0 100px"></div> -->
  <div id="tooltip" class="hidden">
   
  </div>
</template>

<script>
import { onMounted, ref } from 'vue-demi'
import * as d3 from 'd3'
export default {
  setup() {
    const pieChart = () => {
      var duration = 2000,
        transition = 200,
        percent = 75
      const coordinatesOfLine = 99
      var width = 200
      var height = 200
      var thickness = 20
      var anglesRange = 0.75 * Math.PI
      var dataset = {
          lower: calcPercent(0),
          upper: calcPercent(percent),
        },
        radius = Math.min(width, height) / 2.07
      var colors = ['#fb4f5d']
      var arc = d3
        .arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius)
        .cornerRadius(thickness / 2)
      var pie = d3
        .pie()
        .value(function (d) {
          return d
        })
        .sort(null)
        .startAngle(0)
        .endAngle(Math.PI * 2)

      var svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      const gBackground = svg
        .append('g')
        .attr('class', 'background')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      const gForeground = svg
        .append('g')
        .attr('class', 'test')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      var pathBackground = gBackground
        .selectAll('.background')
        .data(pie(dataset.lower))
        .enter()
        .append('path')
        .attr('fill', '#ccc')
        .attr('d', arc)

        .each(function (d) {
          this._current = d
        })
      var pathForeground = gForeground
        .selectAll('.test')
        .data(pie(dataset.lower))
        .enter()
        .append('path')
        .attr('fill', 'transparent')
        .attr('d', arc)
        .each(function (d) {
          this._current = d
        })
      var text = svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .style('font-size', '20px')
      var textPT = svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + 18)
        .attr('y', height / 2)
        .style('font-size', '12px')
        .text('%')

      const line = svg
        .append('line')
        .attr('x1', width / 2)
        .attr('y1', 0)
        .attr('x2', width / 2)
        .attr('y2', thickness + 12)
        .style('stroke', '#000')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '2, 6')
        .style('stroke-linecap', 'round')
        .attr('transform', `rotate(${coordinatesOfLine * 3.6})`)
        .attr('transform-origin', 'center center')
      var progress = 0
      const format = d3.format('0')
      var timeout = setTimeout(function () {
        clearTimeout(timeout)
        pathForeground = pathForeground
          .data(pie(dataset.upper))
          .attr('fill', (d, i) => {
            return i == 0 ? 'red' : 'transparent'
          })
        pathForeground
          .transition()
          .duration(duration)
          .attrTween('d', function (a) {
            var i = d3.interpolate(this._current, a)
            var i2 = d3.interpolateNumber(progress, percent)
            this._current = i(0)
            return function (t) {
              text.text(`${Math.round(i2(t))}`)
              return arc(i(t))
            }
          })
      }, 200)

      function calcPercent(percent) {
        return [percent, 100 - percent]
      }
    }

    const barChart = () => {
      // set svg width and height
      const width = 900,
        height = 600
      const margin = { top: 100, right: 100, bottom: 100, left: 100 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      d3.csv(
        'https://raw.githubusercontent.com/learning-monk/DataVisualizationProjects_JS/master/DataViz_with_D3js/Stacked%20bar%20chart%20-%20suicides%20by%20region/suicide_rates_1985-2016.csv'
      )
        .then((finalData) => {
          finalData.forEach((d) => {
            d.Region = d.Region
            d.female = parseFloat(d.female)
            d.male = parseFloat(d.male)
          })

          // set up stack method
          const stack = d3.stack().keys(['female', 'male'])
          // Data, stacked
          const series = stack(finalData)
          // console.log(series);

          // set-up scales
          const xScale = d3
            .scaleBand()
            .domain(finalData.map((d) => d.Region))
            .range([0, innerWidth])
            .padding(0.7)

          const xAxis = d3.axisBottom().scale(xScale)

          const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
            .rangeRound([innerHeight, 0])

          const yAxis = d3.axisLeft().scale(yScale)

          //Easy colors accessible via a 10-step ordinal scale
          // const colors = d3.scaleOrdinal(d3.schemeCategory10);
          const colors = d3
            .scaleOrdinal()
            .domain(series.map((d) => d.key))
            .range(
              d3
                .quantize(
                  (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
                  series.length
                )
                .reverse()
            )
            .unknown('#ccc')

          //Create SVG element
          const svg = d3
            .select('#tooltip')
            .append('svg')
            .attr('viewBox', [0, 0, width, height])
            .attr("width", width)
            .attr("height", height);

          const mainG = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

          // Add a group for each row of data
          const g = mainG
            .selectAll('g')
            .data(series)
            .enter()
            .append('g')
            .style('fill', (d) => colors(d.key))
            .attr('transform', `translate(0,0)`)

          // Add a rect for each data value
          g.selectAll('rect')
            .data((d) => d)
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
              return xScale(d.data.Region)
            })
            .attr('y', function (d) {
              return yScale(d[1])
            })
            .attr('height', function (d) {
              return yScale(d[0]) - yScale(d[1])
            })
            .attr('width', xScale.bandwidth())
            

          // draw legend
          const legend = mainG
            .append('g')
            .attr('class', 'legend')
            .attr(
              'transform',
              'translate(' + (innerWidth - 110) + ',' + 20 + ')'
            )
            .selectAll('g')
            .data(series)
            .enter()
            .append('g')

          // draw legend colored rectangles
         
          // draw legend text
          

          mainG
            .append('g')
            .call(xAxis)
            .attr('transform', `translate(0,${innerHeight})`)

          mainG.append('g').call(yAxis)

          svg.selectAll('.domain').style('stroke', '#fff')

          
        })
        .catch((error) => {
          console.log(error)
        })
    }

    onMounted(() => {
      barChart()
    })
  },
}
</script>

<style></style>
