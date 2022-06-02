<template>
  <div class="widget">
    <div class="header">Progress Status</div>
    <div id="chart" class="chart-container"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue-demi'
import * as d3 from 'd3'

export default {
  setup() {
    onMounted(() => {
      var percent = 65

      var ratio = percent / 100

      var pie = d3
        .pie()
        .value(function (d) {
          return d
        })
        .sort(null)

      var w = 300,
        h = 300

      var outerRadius = w / 2 - 10
      var innerRadius = 110

      var color = ['#ececec', '#67BAF5']

      var arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI)

      var arcLine = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(20)
        .startAngle(-0.05)
        // .endAngle(2 * Math.PI)

      var svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'shadow')
        .append('g')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')

      var defs = svg.append('svg:defs')

      var inset_shadow = defs.append('svg:filter').attr('id', 'inset-shadow')

      inset_shadow.append('svg:feOffset').attr('dx', 0).attr('dy', 0)

      inset_shadow
        .append('svg:feGaussianBlur')
        .attr('stdDeviation', 4)
        .attr('result', 'offset-blur')

      inset_shadow
        .append('svg:feComposite')
        .attr('operator', 'out')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'offset-blur')
        .attr('result', 'inverse')

      inset_shadow
        .append('svg:feFlood')
        .attr('flood-color', 'black')
        .attr('flood-opacity', 0.7)
        .attr('result', 'color')

      inset_shadow
        .append('svg:feComposite')
        .attr('operator', 'in')
        .attr('in', 'color')
        .attr('in2', 'inverse')
        .attr('result', 'shadow')

      inset_shadow
        .append('svg:feComposite')
        .attr('operator', 'over')
        .attr('in', 'shadow')
        .attr('in2', 'SourceGraphic')

      var pathBackground = svg
        .append('path')
        .attr('d', arc)
        .attr('fill', color[0])
        // .style('filter', 'url(#inset-shadow)')

      var pathForeground = svg
        .append('path')
        .datum('endAngle', 0 )
        .attr('d', arcLine)
        .attr('fill', color[1])
        // .style('filter', 'url(#inset-shadow)')
      var circle = svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', innerRadius)
        .attr('fill', color[0])
        .style('fill-opacity', 0.5)

      // var middleCount = svg
      //   .append('text')
      //   .datum(0)
      //   .text(function (d) {
      //     return d + '%'
      //   })
      //   .attr('class','middleText')
      //   .attr('class','middle')
      //   .attr('class','text-anchor')
      //   .attr('class','dy')
      //   .attr('class', 27)
      //   .style('fill', d3.rgb(color[1]))
      //   .style('font-size', '80px')
      //   .style('filter', 'url(#inset-shadow)')

      var oldValue = 0
      var arcTween = function (transition, newValue, oldValue) {
        transition.attrTween('d', function (d) {
          console.log('d', d);
          var interpolate = d3.interpolate(
            'd',2 * Math.PI * (newValue / 100)
          )

          var interpolateCount = d3.interpolate(oldValue, newValue)
          return function (t) {
            d = interpolate(t)
            middleCount.text(Math.floor(interpolateCount(t)) + '%')
            return arcLine(d)
          }
        })
      }

      var animate = function () {
        pathForeground
          .transition()
          .duration(750)
          .ease('cubic')
          .call(arcTween, percent, oldValue)
        oldValue = percent
        percent = Math.random() * 60 + 20
        setTimeout(animate, 3000)
      }

      setTimeout(animate, 0)
    })
  },
}
</script>

<style>
body {
  background-color: #f6f6f6;
}

#chart {
  width: 50%;
  margin: 50px auto;
  padding: 50px;
  background-color: white;
}
</style>
