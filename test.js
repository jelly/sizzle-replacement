const containsRe = /(?<elem>.*?)(?<selector>:contains\((?<text>[a-zA-Z'"]+)\))(?<selectors>:[a-zA-Z\[\]\(\)=:-]+)?/g;

function ph_select(sel) {
  console.log("ph_select", sel);
  const matches = [...sel.matchAll(containsRe)];
  let elements = [];
  if (matches.length === 0) {
    elements = Array.from(document.querySelectorAll(sel));
  } else {
    // if (matches.length === 1) {
    //   console.log("single", matches);
    //   const containsSelector = matches[0][0];
    //   const text = matches[0][1];
    //   const [mainElem, cssSelectors] = sel.split(containsSelector);
    //   elements = Array.from(document.querySelectorAll(mainElem + cssSelectors)).filter(elem => elem.textContent.indexOf(text) > -1)
    // } else {
    console.log("matches", matches);
    let elem = document;
    matches.forEach((match, idx) => {
        // console.log(sel, match);
        // const containsSelector = match;
        // const text = match[1];
        // console.log("matches", containsSelector, text);
        // const [mainElem, cssSelectors] = sel.split(containsSelector);
        // console.log(mainElem, cssSelectors);
        const tempSelector = match.groups.elem + (match.groups.selectors || "");
        console.log("selector", tempSelector);
        console.log(match.groups.text);
        // console.log(Array.from(tempElem.querySelectorAll(tempSelector)));

        const textMatches = elem => elem.textContent.indexOf(match.groups.text) > -1;
        console.log("elements", elements);
        if (elements.lenght === 0) {
          elements = elements.map(elem => elem.querySelectorAll(tempSelector).filter(textMatches)).filter(elem => elem);
        } else {
          elements = Array.from(elem.querySelectorAll(tempSelector)).filter(textMatches);
        }
    })
  }

  return elements;
}

QUnit.module('sizzle', function() {
  QUnit.test('simple case', function(assert) {
    const elem = document.getElementById("case1");
    const elements = ph_select("#case1");
    assert.equal(elements.length, 1);
    assert.equal(elements[0], elem);
  });
  QUnit.test(':contains simple case', function(assert) {
    const elem = document.getElementById("case1");
    const elements = ph_select("body .foo:contains(Banana)");
    assert.equal(elements.length, 1);
    assert.equal(elements[0], elem);
  });
  QUnit.test(':contains extra selectors case', function(assert) {
    const elem = document.getElementById("case1");
    const elements = ph_select(".foo:contains(Banana):not([disabled])");
    assert.equal(elements.length, 1);
    assert.equal(elements[0], elem);
  });
  QUnit.test('multiple :contains simple case', function(assert) {
    const elem2 = document.getElementById("case3");
    const elements = ph_select("body div:contains(foo) button:contains(bar)");
    assert.equal(elements.length, 1);
    assert.equal(elements[0], elem2);
  });
  QUnit.test('multiple :contains simple case', function(assert) {
    const elem = document.getElementById("case4");
    const elements = ph_select(".pf-v5-c-breadcrumb a:contains('Applications'):not([disabled]):not([aria-disabled=true])");
    assert.equal(elements.length, 1);
    assert.equal(elements[0], elem);
  });
});
