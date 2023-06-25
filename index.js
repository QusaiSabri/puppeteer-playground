var membershipTypeSelectors = require('./staticData');
const puppeteer = require('puppeteer');

// console.log(membershipTypeSelectors); // 'some value'

(async () => {
  const browser = await puppeteer
    .launch({
      headless: false,
      defaultViewport: { width: 1920, height: 2080 } //,
      // slowMo: 200
    })
    .catch(error => {
      console.log(error);
    });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://www.texasexes.org/membership/join', {
    waitUntil: 'networkidle2'
  });

  // Choose membership type
  let selector = '.accordion__item h2'; //+ ' ' + membershipTypeSelectors.Life['Recent Grad'];

  // const membershipTypes = await page.evaluate(() =>
  //   Array.from(document.querySelectorAll('.accordion__item h2')).map(
  //     membership => ({
  //       type: membership.innerText.trim()
  //     })
  //   )
  // );

  // console.log(membershipTypes);

  await Promise.all([
    page.waitForNavigation(),
    page.evaluate(
      selector => document.querySelectorAll(selector)[2].click(),
      selector
    )
  ]).then(await page.click('#edit-actions-01-submit--3'));

  // const inputs = await page.evaluate(() =>
  //   Array.from(document.querySelectorAll('.inputWrapper input'), x =>
  //     x.title.trim()
  //   )
  // );

  await page.type('[title="First name"]', 'Qusai');
  await page.type('[title="Maiden name"]', 'My maiden name');
  await page.type('[title="Last name"]', 'Sabri');

  //Set the Country
  const countriesDropdown = await page.$$eval(
    'select#tfa_6297[title="Country"] option',
    all =>
      all.map(country => ({
        name: country.textContent,
        value: country.value
      }))
  );

  //Do the country selection here
  await countriesDropdown.filter(c => {
    c.name === 'United States'
      ? page.select('[title="Country"]', c.value)
      : null;
  });
  //Set the Country ends here ..

  //4835 Lyndon B Johnson Fwy #1100, Dallas, TX 75244
  await page.type(
    '[title="Street address"]',
    '4835 Lyndon B Johnson Fwy #1100'
  );
  await page.type('[title="City"]', 'Dallas');

  //Set the State
  const statesDropdown = await page.$$eval(
    'select#tfa_6527[title="State"] option',
    all =>
      all.map(state => ({
        name: state.textContent,
        value: state.value
      }))
  );
  //Do the state selection here
  await statesDropdown.filter(c => {
    c.name === 'TX' ? page.select('[title="State"]', c.value) : null;
  });
  //Set the State ends here ..

  await page.type('[title="Postal code"]', '75244');

  //Email
  await page.type('[title="Email"]', 'qusai@gmail.com');

  //Email Type (radio button)
  // Radio buttons
  const radios = await page.$$eval('#tfa_6587 > span label', inputs => {
    return inputs.map(emailType => ({
      text: emailType.textContent,
      id: emailType.id
    }));
  });
  // Do the Email Type selection here
  await radios.filter(option => {
    option.text === 'Work' ? page.click('#' + option.id) : null;
  });
  //Email Type ends here

  //Phone
  await page.evaluate(text => {
    document.querySelector('[title="Phone"]').value = text;
  }, '4696180706');

  //Phone Type (radio button)
  // Radio buttons
  const PhoneRadios = await page.$$eval('#tfa_6592 > span label', inputs => {
    return inputs.map(phoneType => ({
      text: phoneType.textContent,
      id: phoneType.id
    }));
  });
  // Do the Email Type selection here
  await PhoneRadios.filter(option => {
    option.text === 'Mobile' ? page.click('#' + option.id) : null;
  });
  //Email Type ends here

  await page.screenshot({ path: 'example.png', fullPage: true });

  await browser.close();
})();
