const UI_loaded_event = new Event("UI_loaded");

const showStyle = "flex";

const pad = (num, size) => {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

const printArrayOfObjectsToHTMLTable = (arr) => {
  const _ = window._;
  let out = "<table>";
  _.forEach(arr, (value) => {
    out += "<tr>";
    _.forEach(value, (value2) => {
      out += `<td>${value2}</td>`;
    });
    out += "</tr>";
  }
  );
  out += "</table>";
  return out;
};


const getSales = () => {
  const _ = window._;

  const getProfitMultiplier = (cat) => {
    switch (cat) {
      case "Clothing &amp; Accessories":
      case "Beauty &amp; Grooming":
      case "Jewelry":
      case "Kindle Hardware":
      case "Luggage":
      case "Luxury Beauty":
      case "Prime Exclusive Phones":
      case "Watches":
      case "Clothing &amp; Accessories":
      case "Clothing & Accessories":
        return 0.03;
      case "Electronics":
      case "Office Products":
      case "Industrial &amp; Scientific":
      case "Industrial & Scientific":
      case "Amazon Instant Video":
      case "Health &amp; Personal Care":
      case "Health & Personal Care":
      case "Books":
      case "Toys &amp; Games":
      case "Toys & Games":
      case "Other Gift Card Brands":
      case "Health &amp; Household":
      case "Health & Household":
      case "Grocery & Gourmet Food":
      case "Grocery &amp; Gourmet Food":
      case "Electronic Components &amp; Home Audio":
      case "Prime Pantry":
      case "Gift Card":
      case "Amazon Gift Cards":
        return 0.01;
      case "Computers, Tablets &amp; Components":
      case "TV":
      case "Video Games":
        return 0.0025;
      case "Amazon Fresh":
      case "Kindle Unlimited Memberships":
      case "Wine, Spirits &amp; Beer":
        return 0;
      default:
        return 0.02;
    }
  };

  const getSaleProfit = ({ category, price, qty }) => {
    return getProfitMultiplier(category) * parseFloat(price) * parseInt(qty);
  };

   const matchWithPropertyName = (tag) => {
    switch (tag) {
      case "jdb-ss-20":
        return `${tag} (Subscribe & Save page)`;
      case "xglz-wid-20":
        return `${tag} (Product posts)`;
      case "jd-household-20":
        return `${tag} (Household deals post)`;
      case "jd-feed-20":
        return `${tag} (Feed posts)`;
      case "jdb-daily-20":
      case "jd-daily-20":
        return `${tag} (Daily deals post)`;
      case "jdb-grocery-20":
      case "jd-grocery-20":
        return `${tag} (Grocery deals post)`;
      case "jdb-coupon-20":
        return `${tag} (Coupon deals post)`;
      case "j00000996-20":
        return `${tag} (Variations popup)`;
      case "jdb-deal-20":
      case "jd-deal-20":
        return `${tag} (React deal site)`;
      case "jdb-fb-20":
        return `${tag} (Popular deals)`;
      case "xglzwckb-20":
      case "jd-xglzwckb-20":
        return `${tag} (Variations tool)`;
      case "jdb-toys-20":
      case "jd-toys-20":
        return `${tag} (Toys page)`;
      case "jdb-lego-20":
        return `${tag} (Lego page)`;
      case "jdb-gift-cards-20":
        return `${tag} (Gift card page)`;
      case "jdb-barbie-20":
        return `${tag} (Barbie page)`;
      case "jdb-clothes-20":
        return `${tag} (Clothing page)`;
      case "jdb-pets-20":
        return `${tag} (Pet supplies page)`;
      case "jdb-brand-20":
        return `${tag} (Brand pages)`;
      case "vfrifr-20":
        return `${tag} (Legacy links)`;
      case "jdb-buy-save-20":
        return `${tag} (Amazon promotions page)`;
      case "jdb-bts-20":
        return `${tag} (Back to school/office supplies)`;
      case "sr22-20":
        return `${tag} (React s&s page)`;
      case "jdb-beauty-20":
        return `${tag} (Beauty deals post)`;
      case "jdb-under-3-20":
        return `${tag} (Under $3 page)`;
      case "jdb-se-20":
        return `${tag} (Best selling page)`;
      case "jdb-board-games-20":
       return `${tag} (Board games page)`;
      case "jd-dogs-20":
        return `${tag} (Dogs page)`;
      case "jd-snacks-20":
        return `${tag} (Snacks page)`;
      case "list-jd-20":
        return `${tag} (React lists pages)`;
      case "jdb-under-1-20":
        return `${tag} (Under $1 post)`;
      case "jdb-diapers-20":
        return `${tag} (Diapers post)`;
      case "jdb-books-20":
        return `${tag} (Books post)`;
      case "jd-page-20":
        return `${tag} (jd product page)`;
      case "jd-sh-20":
        return `${tag} (jd page deals)`;
      case "jd-brand-20":
        return `${tag} (jd brand deals)`;
      case "jdb-stocking-20":
        return `${tag} (Stocking stuffers post)`;
      default:
        return `${tag} (unknown)`;
    }
  };

  const objToHTMLTable = (profitObj, options = {}) => {
    const { 
      showRawValue = false,
      matchWithProperty = false
     } = options;
    let obj = _.map(profitObj, (value, key) => ({ 
      key: matchWithProperty ? `${matchWithPropertyName(key)}` : `${key}`, 
      profit: value
    }));
    obj = _.orderBy(obj, ["profit"], ["desc"]);

    let out = "<table>";
    _.forEach(obj, (value) => {
      out += `<tr><td>${value.key}</td><td>`;
      out += showRawValue ? `${value.profit}`: `$${value.profit.toFixed(
        2
      )}`;
      out += `</td></tr>`;
    });
    out += "</table>";
    return out;
  };

  const printSalesTable = (
    salesMap,
    lineItems,
    extraText,
    bountyCash,
    bounties,
    extraLines = ''
  ) => {
    let totalProfit = 0;
    let totalSales = 0;
    let totalItems = 0;

    bounties = _.orderBy(bounties, ["earning"], ["desc"]);

    console.log('bounties', bounties);

    let out = `<div class="group">
    
    <p>Bounties</p>
    <table>`;
    _.forEach(bounties, (value) => {
      out +=
        "<tr><td>" +
        value.text +
        "</td><td>" +
        value.tag +
        "</td><td>" +
        value.events +
        "</td><td>$" +
        value.per.toFixed(2) +
        "</td><td>$" +
        value.earning.toFixed(2) +
        "</td></tr>";
    });
    out += "</table></div>";

    out += `<div class="group">
    <p>Sales by QTY</p>
    <table>`;
    _.forEach(salesMap, (value) => {
      totalProfit = value.totalProfit + totalProfit;
      totalSales = value.totalSpend + totalSales;
      totalItems = value.qty + totalItems;

      out +=
        "<tr><td>" +
        value.qty +
        "</td><td>$" +
        value.totalProfit.toFixed(2) +
        "</td><td>$" +
        value.totalSpend.toFixed(2) +
        '</td><td><a href="https://www.amazon.com/gp/product/' +
        value.asin +
        '" target="_blank">' +
        value.title +
        "</a></td></tr>";
    });
    out += "</table></div>";

    const withoutBounty = totalProfit;

    totalProfit += bountyCash;

    const outStats = `
      <div>
      <p>Total profit = <span style="font-size:29px;font-weight:bold;">$${totalProfit.toFixed(
        2
      )}</span></p>
      <p>Total sales = $${totalSales.toFixed(2)}</p>
      <p>Total items = ${totalItems} with ${lineItems} line items</p>
      <p>Total bounty = $${bountyCash.toFixed(2)}</p>
      <p>Total profit minus bounty = $${withoutBounty.toFixed(2)}</p>
      ${extraLines}
      </div>

    `
    out = outStats + extraText + out;



    // out = `<p>Total sales = $${totalSales.toFixed(2)}</p>${extraText}${out}`;
    // out = `<p>Total items = ${totalItems} with ${lineItems} line items</p>${out}`;
    // out = `<p>Total bounty = $${bountyCash.toFixed(2)}</p>${out}`;
    // out = `<p>Total profit minus bounty = $${withoutBounty.toFixed(
    //   2
    // )}</p>${out}`;
    // out = '';
    // out = `<div class="group"><p>Total profit = <span style="font-size:29px;font-weight:bold;">$${totalProfit.toFixed(
    //   2
    // )}</span></p>${out}`;

    return out;
  };

  const printResponse = (response, bountyResponse) => {
    let data = null;
    let bountyData = null;
    try {
      bountyData = JSON.parse(bountyResponse);
      data = JSON.parse(response);
    } catch (e) {
      console.log("Early return due to parsing error " + e);
      return;
    }

    if (!data) {
      return;
    }

    const records = data["records"];
    const bounties = [];
    let totalProfitByTags = {};
    let bountyCash = 0;

    for (let i = 0; i < bountyData.records.length; i++) {
      bounties.push({
        text: bountyData.records[i].bounty_event_string_id,
        tag: bountyData.records[i].tag_value,
        events: bountyData.records[i].bounty_events,
        per: parseInt(bountyData.records[i].bounty_earning_per_quantity, 10),
        earning: parseFloat(bountyData.records[i].bounty_earnings, 10),
      });

      bountyCash += parseFloat(bountyData.records[i].bounty_earnings);

      const trackingKey = bountyData.records[i].tag_value;
      const tagsAdditional = !totalProfitByTags[trackingKey] ? 0 : totalProfitByTags[trackingKey];
      totalProfitByTags[trackingKey] = parseFloat(bountyData.records[i].bounty_earnings) + tagsAdditional;

    }

    let cats = {};
    let tags = {};

    let salesMap = {};
    let lineItems = 0;
    let salesInfo = {};
    let salesQTYByTag = {};
    

    const mostExpensive = {
      title: '',
      price: 0,
      profit: 0,
      qty: 0,
      tag: '',
      ASIN: null
    }

    for (let i = 0; i < data["records"].length; i++) {
      lineItems++;

      salesInfo = {};

      const order = {
        qty: parseInt(records[i]["ordered_items"]),
        category: records[i]["product_category_string_id"],
        trackingID: records[i]["tracking_id"],
        price: parseFloat(records[i]["price"]),
        totalSpend: parseFloat(
          records[i]["price"] * records[i]["ordered_items"]
        ),
        title: records[i]["product_title"],
        merchant: records[i]["merchant_name"],
        asin: records[i]["asin"],
      };

      const asin = records[i]["asin"];
      const qty = parseInt(records[i]["ordered_items"]);
      const itemProfit = getSaleProfit(order);

      if (!salesMap[asin]) {
        salesInfo = {
          ...order,
          totalProfit: itemProfit,
        };

        salesMap[asin] = salesInfo;
      } else {
        salesInfo = salesMap[asin];
        salesInfo.totalSpend = salesInfo.totalSpend + order.totalSpend;
        salesInfo.qty = salesInfo.qty + order.qty;
        salesInfo.totalProfit = salesInfo.totalProfit + itemProfit;
        salesMap[asin] = salesInfo;
      }

      const trackingKey = records[i]["tracking_id"];
      const trackingAdditional = !tags[trackingKey] ? 0 : tags[trackingKey];
      tags[trackingKey] = parseFloat(itemProfit) + trackingAdditional;

      const tagsAdditional = !totalProfitByTags[trackingKey] ? 0 : totalProfitByTags[trackingKey];
      totalProfitByTags[trackingKey] = parseFloat(itemProfit) + tagsAdditional;

      const qtyAdditional = !salesQTYByTag[trackingKey] ? 0 : salesQTYByTag[trackingKey];
      salesQTYByTag[trackingKey] = qty + qtyAdditional;


      const cat = records[i]["product_category_string_id"];
      const additionalProfit = !cats[cat] ? 0 : cats[cat];
      cats[cat] = parseFloat(itemProfit) + additionalProfit;

      if (order.price > mostExpensive.price) {
        mostExpensive.price = order.price;
        mostExpensive.title = order.title;
        mostExpensive.qty = order.qty;
        mostExpensive.profit = itemProfit;
        mostExpensive.tag = trackingKey;
        mostExpensive.ASIN = asin;
      }

    }

    const expensiveItem = mostExpensive.ASIN === null ? '' : `<p>Most expensive item = <a href="https://www.amazon.com/gp/product/${mostExpensive.ASIN}" target="_blank">${mostExpensive.title}</a> at $${mostExpensive.price.toFixed(2)} with qty ${mostExpensive.qty} and profit of $${mostExpensive.profit.toFixed(2)}.</p>`;
    const tableHTML = `<div class="group">
    <p>Tags</p>
    ${objToHTMLTable(tags, { matchWithProperty: true })}</div><div class="group">
    <p>Categories</p>
    ${objToHTMLTable(cats)}</div>`;

    salesMap = _.orderBy(salesMap, ["qty"], ["desc"]);
    let out = "";
    const button = `<button id="create_button"></button>`;
    const homeMode = JSON.parse(
      window?.localStorage?.getItem("homeMode") || "false"
    );

    console.log(data["records"]);

    const displaySalesHidden = homeMode === false ? showStyle : "none";
    const displaySalesShown = homeMode === false ? "none" : showStyle;
    out = `${button}<details id="sales_hidden" style="display:${displaySalesHidden}"><summary>Site totals</summary>${printSalesTable(
      salesMap,
      lineItems,
      tableHTML,
      bountyCash,
      bounties,
      expensiveItem
    )}
    <div class="group">
      <p>Total profit by tags</p>
       ${objToHTMLTable(totalProfitByTags)}
    </div>
    <div class="group">
       <p>Total sales by tags</p>
       ${objToHTMLTable(salesQTYByTag, { showRawValue: true })}
       </div>
       <div class="group">
       <p>Today's latest sales</p>
       ${printArrayOfObjectsToHTMLTable(data["records"])}
       </div>

    </details>
    `;
    out = `${out}<div id="sales_shown" class="sales_shown" style="display:${displaySalesShown}">${printSalesTable(
      salesMap,
      lineItems,
      tableHTML,
      bountyCash,
      bounties,
      expensiveItem
    )}
    <div class="group">
      <p>Total profit by tags</p>
       ${objToHTMLTable(totalProfitByTags, { matchWithProperty: true})}
       </div>
       <div class="group">
       <p>Total sales by tags</p>
       ${objToHTMLTable(salesQTYByTag, { showRawValue: true, matchWithProperty: true })}
       </div>
       <div class="group">
       <p>Today's latest sales</p>
       ${printArrayOfObjectsToHTMLTable(data["records"])}
       </div>
    </div>
`;
    document.body.innerHTML = out;
    window.dispatchEvent(UI_loaded_event);
  };

  var xmlhttp = new XMLHttpRequest();
  var url =
    "https://affiliate-program.amazon.com/home/reports/table.json?query%5Btype%5D=realtime&query%5Bstart_date%5D=2017-08-29&query%5Bend_date%5D=2017-08-29&query%5Border%5D=desc&query%5Btag_id%5D=all&query%5Bcolumns%5D=product_title%2Casin%2Cproduct_category%2Cmerchant_name%2Cordered_items%2Ctracking_id%2Cprice&query%5Bskip%5D=0&query%5Bsort%5D=day&query%5Blimit%5D=25000&store_id=beyondavatars-20";

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var xmlhttp2 = new XMLHttpRequest();
      xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
          printResponse(xmlhttp.responseText, xmlhttp2.responseText);
        }
      };

      const month = pad(new Date().getMonth() + 1, 2);
      const day = pad(new Date().getDate(), 2);
      const year = new Date().getFullYear();

      xmlhttp2.open(
        "GET",
        `https://affiliate-program.amazon.com/home/reports/table.json?query%5Btype%5D=bounty&query%5Bstart_date%5D=${year}-${month}-${day}&query%5Bend_date%5D=${year}-${month}-${day}&query%5Btag_id%5D=all&query%5Bcolumns%5D=bounty_event_name%2Cbounty_event_type%2Cbounty_revenue%2Ctag_value%2Cbounty_events%2Cbounty_earning_per_quantity%2Cbounty_earnings%2Ctag_id&query%5Bskip%5D=0&query%5Bsort%5D=tag_value&query%5Blimit%5D=25&query%5Blast_accessed_row_index%5D=0&store_id=beyondavatars-20`,
        true
      );

      xmlhttp2.onerror = function () {
        console.log("** An error occurred during the transaction");
      };

      xmlhttp2.send();
      // printResponse(xmlhttp.responseText);
    }
  };

  try {
    xmlhttp.open("GET", url, true);

    xmlhttp.onerror = function () {
      console.log("** An error occurred during the transaction");
    };

    xmlhttp.send();
  } catch (e) {
    console.log("Caught", e);
  }
};

window.addEventListener("UI_loaded", function load(event) {
  var createButton = document.getElementById("create_button");
  createButton.addEventListener("click", function () {
    const foo = JSON.parse(window.localStorage.getItem("homeMode"));
    const newHomeMode = foo ? false : true;

    if (newHomeMode) {
      document.getElementById("sales_hidden").style.display = "none";
      document.getElementById("sales_shown").style.display = showStyle;
    } else {
      document.getElementById("sales_hidden").style.display = showStyle;
      document.getElementById("sales_shown").style.display = "none";
    }

    window.localStorage.setItem("homeMode", newHomeMode);
    window.getSales();
  });
});

window.getSales = getSales;

(function () {
  try {
    getSales();
    setInterval(getSales, 30000);
  } catch (e) {
    console.log("Error caught: " + e);
  }
})();
