// Declare variables at the beginning of the script
const Global = {};
let margin, width, height, xScale, yScale, xAxis, svg, texture;

// Call initialization functions when document is ready
$(document).ready(function() {
  setOccupationDropdown();
  setPredictButton();
  setInput();
  buildDefaultGraph();
});

// Refactored function to build default graph
function buildDefaultGraph() {
  const defaultData = [    { candidate: "Sanders", probability: 0.251 },    { candidate: "Clinton", probability: 0.197 },    { candidate: "Carson", probability: 0.185 },    { candidate: "Cruz", probability: 0.185 },    { candidate: "Rubio", probability: 0.054 },    { candidate: "Paul", probability: 0.029 },    { candidate: "Bush", probability: 0.025 }  ];

  margin = { top: 20, right: 10, bottom: 30, left: 10 };
  width = 800 - margin.left - margin.right;
  height = 400 - margin.top - margin.bottom;

  xScale = d3.scale
    .ordinal()
    .rangeRoundBands([0, width], 0.5);

  yScale = d3.scale
    .linear()
    .range([height, 0]);

  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom");

  svg = d3
    .select(".chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  texture = textures.lines()
    .lighter()
    .stroke("#7FDBFF");

  svg.call(texture);

  xScale.domain(defaultData.map(function(d) { return d.candidate; }));
  yScale.domain([0, d3.max(defaultData, function(d) { return d.probability; })]);

  svg.append("g")
    .attr("class", "x axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  const svgEnter = svg.selectAll(".bar")
    .data(defaultData)
    .enter();

  svgEnter.append("rect")
    .attr("class", "bar")
    .style("fill", texture.url())
    .attr("x", function(d) { return xScale(d.candidate); })
    .attr("width", xScale.rangeBand())
    .attr("y", function(d) { return yScale(d.probability); })
    .attr("height", function(d) { return height - yScale(d.probability); });

  svgEnter.append("text")
    .attr("class", "percentage")
    .attr("transform", function(d) { return "translate(" + (xScale(d.candidate) + 2) + "," + (height - 3) + ")"; })
    .text(function(d) { return Math.round(d.probability * 1000) / 10 + "%"; });
}

function updateChart(newData) {
  // remove all elements with the class "percentage"
  d3.selectAll('.percentage').remove()

  // select all existing .bar elements and bind newData to them
  const bars = svg.selectAll('.bar').data(newData)

  // add a new rectangle for each new data point
  bars.enter().append('rect')
    .attr('class', 'bar')
    .style('fill', texture.url())

  // update the x and y scales with the new data
  xScale.domain(newData.map(d => d.candidate))
  yScale.domain([0, d3.max(newData, d => d.probability)])

  // add a new text element for each new data point and bind newData to them
  svg.selectAll('.percentage')
    .data(newData)
    .enter()
    .append('text')
    .attr('class', 'percentage')
    .attr('transform', d => `translate(${xScale(d.candidate) + 2},${height - 3})`)
    .text(d => `${Math.round(d.probability * 1000) / 10}%`)

  // update the existing bars with the new data
  bars.transition().duration(500)
    .attr('y', d => yScale(d.probability))
    .attr('x', d => xScale(d.candidate))
    .attr('width', xScale.rangeBand())
    .attr('height', d => height - yScale(d.probability))

  // update the x-axis with the new data
  svg.selectAll('.x-axis')
    .transition()
    .duration(500)
    .call(xAxis)

  // remove any excess bars
  bars.exit().remove()
}

function setOccupationDropdown() {
  // create an options HTML string for the occupation dropdown
  let html = "<option value=''>Occupation</option>"
  Global.occupations.forEach(str => {
    const strMod = str.replace(/ /g, '*')
    html += `<option value=${strMod}>${str}</option>`
  })
  // set the HTML of the occupation dropdown and initialize the dropdown
  $('.occupation-dropdown').html(html)
  $('.ui.dropdown').dropdown()
}

function setPredictButton() {
  // add a click event listener to the predict button
  $('.predict').click(event => {
    event.preventDefault()
    // if the button is disabled, do nothing
    if ($('.predict').hasClass('disabled')) return
    // add loading and disabled classes to the button
    $('.predict').addClass('loading disabled')

    // get the input values and store them in an object
    const i1 = $('.i1').val().toUpperCase()
    const i2 = $('.i2').dropdown('get value')
    const i3 = $('.i3').dropdown('get value').split('*').join(' ')
    const i4 = $('.i4').val()
    const o = { i1, i2, i3, i4 }
    console.log(o)

    // make an AJAX request to get predictions
    $.ajax({
      dataType: 'text',
      url: 'https://hq33siilacynsmmt4rkgewxcoi0optah.lambda-url.us-east-1.on.aws/',
      data: o,
      success: displayResults,
    })
    // set a timeout to show an alert if the response takes too long
    Global.timeout = setTimeout(() => {
      $('.alert').show()
    }, 8000)
  })
}

const updatePredictText = ({ candidate, probability }) => {
  const html = `The predictor chooses <span class='prediction'> ${candidate} </span> with a probability of <span class='prediction'> ${Math.round(probability * 1000) / 10}</span>%`;
  $('.predict-text').html(html);
}


const displayResults = (data) => {
  console.log('displayResults', data);
  clearTimeout(Global.timeout);
  $('.alert').hide();
  $('.predict').removeClass('loading disabled');
  const results = JSON.parse(data).results[0];
  const candsWithProbs = Object.keys(results)
    .map((key) => {
      const cand = Global.cands[+key.slice(1)].split(',')[0];
      const prob = results[key];
      return { candidate: cand, probability: prob };
    })
    .filter((d) => d.probability > 0)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10);
  console.log(candsWithProbs);
  updateChart(candsWithProbs);
  updatePredictText(candsWithProbs[0]);
};

const setInput = () => {
  $('.i4').keypress((event) => {
    if (!(event.charCode >= 48 && event.charCode <= 57)) {
      return false;
    }
    $('.predict').removeClass('disabled');
  });
};

const callback = (data) => {
  $('.predict').removeClass('loading disabled');
  const results = data.results[0];
  console.log(data);
  const candsWithProbs = Object.keys(results)
    .map((key) => {
      const cand = Global.cands[+key.slice(1)].split(',')[0];
      const prob = results[key];
      return { candidate: cand, probability: prob };
    })
    .filter((d) => d.probability > 0)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10);
  console.log(candsWithProbs);
  updateChart(candsWithProbs);
  updatePredictText(candsWithProbs[0]);
};

Global.cands = [
'Bush, Jeb',
'Carson, Benjamin S.',
'Christie, Christopher J.',
'Clinton, Hillary Rodham',
"Cruz, Rafael Edward",
'Fiorina, Carly',
'Graham, Lindsey O.',
'Huckabee, Mike',
'Jindal, Bobby',
'Kasich, John R.',
'Lessig, Lawrence',
"O'Malley, Martin Joseph",
'Pataki, George E.',
'Paul, Rand',
'Perry, James R.',
'Rubio, Marco',
'Sanders, Bernard',
'Santorum, Richard J.',
'Stein, Jill',
'Trump, Donald J.',
'Walker, Scott',
'Webb, James Henry Jr.'
]


Global.occupations = [
'NOT EMPLOYED',
'STUDENT',
'RETIRED',
'ACCOUNT MANAGER',
'ACCOUNTANT',
// 'ACCOUNTING',
'ACTOR',
// 'ADMINISTRATION',
'ADMINISTRATIVE ASSISTANT',
'ADMINISTRATOR',
'ADVERTISING',
'ADVISOR',
'AGRICULTURE',
'AIRLINE PILOT',
'ANALYST',
'ANESTHESIOLOGIST',
'ARCHITECT',
'ARTIST',
'ATTORNEY',
'AUTHOR',
'BANKER',
// 'BANKING',
'BOOKKEEPER',
'BROKER',
'BUILDER',
// 'BUSINESS',
'BUSINESS ANALYST',
'BUSINESS EXECUTIVE',
'BUSINESS MANAGER',
'BUSINESS OWNER',
'BUSINESSMAN',
// 'C.E.O.',
'CAREGIVER',
'CARPENTER',
'CASHIER',
'CEO',
'CFO',
'CHAIRMAN',
'CHEMIST',
// 'CHIEF EXECUTIVE OFFICER',
'CHIROPRACTOR',
'CIVIL ENGINEER',
'CLERGY',
'CLERK',
'CLINICAL PSYCHOLOGIST',
'CLINICAL SOCIAL WORKER',
'COLLEGE PROFESSOR',
'COMMERCIAL REAL ESTATE',
'COMMUNICATIONS',
'COMPUTER PROGRAMMER',
'CONSTRUCTION',
'CONSULTANT',
// 'CONSULTING',
'CONTRACTOR',
'CONTROLLER',
'COO',
'COUNSELOR',
'CPA',
'CRNA',
'CTO',
'CUSTOMER SERVICE',
'DATABASE ADMINISTRATOR',
'DENTIST',
'DESIGNER',
'DEVELOPER',
'DIGITAL',
'DIRECTOR',
'DIRECTOR OF OPERATIONS',
'DISABLED',
'DISABLED VETERAN',
'DOCTOR',
'DRIVER',
'ECONOMIST',
'EDITOR',
// 'EDUCATION',
'EDUCATOR',
'ELECTRICAL ENGINEER',
'ELECTRICIAN',
'ENGINEER',
// 'ENGINEERING',
'ENTREPRENEUR',
'ESTIMATOR',
'EXECUTIVE',
'EXECUTIVE ASSISTANT',
'EXECUTIVE DIRECTOR',
'FACULTY',
'FARMER',
// 'FARMING',
'FILMMAKER',
'FINANCE',
'FINANCIAL ADVISOR',
'FINANCIAL ANALYST',
'FINANCIAL PLANNER',
'FINANCIAL SERVICES',
'FIREFIGHTER',
'FLIGHT ATTENDANT',
'FOUNDER',
'FUNDRAISER',
'GENERAL CONTRACTOR',
'GENERAL MANAGER',
'GEOLOGIST',
'GEOPHYSICIST',
'GRADUATE STUDENT',
'GRAPHIC DESIGNER',
// 'HEALTH CARE',
'HEALTHCARE',
'HOMEMAKER',
'HOUSEWIFE',
'HUMAN RESOURCES',
// 'INFO REQUESTED',
// 'INFORMATION REQUESTED',
// 'INFORMATION REQUESTED PER BEST EFFORTS',
'INFORMATION TECHNOLOGY',
'INSTRUCTOR',
'INSURANCE',
'INSURANCE AGENT',
'INSURANCE BROKER',
'INSURANCE SALES',
'INTERIOR DESIGNER',
'INVESTMENT ADVISOR',
'INVESTMENT BANKER',
// 'INVESTMENTS',
'INVESTOR',
'IT',
'IT CONSULTANT',
'IT MANAGER',
'LABORER',
'LANDLORD',
'LANDMAN',
'LAW PROFESSOR',
'LAWYER',
'LEGAL ASSISTANT',
'LETTER CARRIER',
'LIBRARIAN',
// 'M.D.',
'MACHINIST',
// 'MANAGEMENT',
'MANAGEMENT CONSULTANT',
'MANAGER',
'MANAGING DIRECTOR',
'MANAGING PARTNER',
'MANUFACTURING',
'MARKETING',
'MARKETING DIRECTOR',
'MARKETING MANAGER',
'MASSAGE THERAPIST',
'MD',
'MECHANIC',
'MECHANICAL ENGINEER',
'MEDICAL DOCTOR',
'MILITARY',
'MINISTER',
// 'MOM',
'MUSICIAN',
// 'NONE',
'NURSE',
'NURSE PRACTITIONER',
'OCCUPATIONAL THERAPIST',
'OFFICE MANAGER',
'OPERATIONS MANAGER',
'OPERATOR',
'OPHTHALMOLOGIST',
'OPTOMETRIST',
'ORTHODONTIST',
'OWNER',
'PAINTER',
'PARALEGAL',
'PARTNER',
'PASTOR',
'PEDIATRICIAN',
'PHARMACIST',
'PHOTOGRAPHER',
'PHYSICAL THERAPIST',
'PHYSICIAN',
'PHYSICIAN ASSISTANT',
'PHYSICIST',
'PILOT',
'PLUMBER',
'POLICE OFFICER',
'PRESIDENT',
// 'PRESIDENT & CEO',
'PRESIDENT/CEO',
'PRINCIPAL',
'PRODUCER',
'PRODUCT MANAGER',
'PROFESSOR',
'PROGRAM MANAGER',
'PROGRAMMER',
'PROJECT COORDINATOR',
'PROJECT MANAGER',
'PROPERTY MANAGEMENT',
'PROPERTY MANAGER',
'PSYCHIATRIST',
'PSYCHOLOGIST',
'PSYCHOTHERAPIST',
'PUBLIC RELATIONS',
'PUBLISHER',
'R.N.',
'RANCHER',
'REAL ESTATE',
'REAL ESTATE AGENT',
'REAL ESTATE APPRAISER',
'REAL ESTATE BROKER',
'REAL ESTATE DEVELOPER',
// 'REAL ESTATE DEVELOPMENT',
'REAL ESTATE INVESTOR',
'REAL ESTATE SALES',
'REALTOR',
'REFUSED',
'REGISTERED NURSE',
// 'REQUESTED PER BEST EFFORTS',
'RESEARCHER',
'RESTAURANT OWNER',
'RETAIL',
// 'RETIRED',
// 'RETIRED TEACHER',
// 'RN',
'SALES',
'SALES ASSOCIATE',
'SALES MANAGER',
// 'SALESMAN',
'SCIENTIST',
'SECRETARY',
'SECURITY',
// 'SELF',
// 'SELF EMPLOYED',
'SELF-EMPLOYED',
'SENIOR MANAGER',
'SENIOR VICE PRESIDENT',
'SMALL BUSINESS OWNER',
'SOCIAL WORKER',
// 'SOFTWARE',
'SOFTWARE DEVELOPER',
'SOFTWARE ENGINEER',
'STORE MANAGER',
'STRATEGIST',
// 'STUDENT',
'SUPERVISOR',
'SURGEON',
'SYSTEMS ENGINEER',
'TEACHER',
'TECHNICAL WRITER',
'TECHNICIAN',
'THERAPIST',
'TRUCK DRIVER',
'UNEMPLOYED',
'VETERINARIAN',
'VICE PRESIDENT',
'VOLUNTEER',
'VP',
'WEB DEVELOPER',
'WRITER'
]
