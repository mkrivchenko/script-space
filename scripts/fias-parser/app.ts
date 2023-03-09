//
// Script dependencies:
//	"puppeteer": "^19.7.2"
//

import puppeteer from 'puppeteer';
import { promises } from "fs";
import { join } from 'path';


let arr: string[] = [];

(async () => {
	const baseURL = 'https://xn--80ap2aj.xn--80asehdb';

	console.log('Начало');
	const brower = await puppeteer.launch();
	const page = await brower.newPage();

	await page.goto('https://xn--80ap2aj.xn--80asehdb/dd3a6aab-b2e1-46f9-99ab-b162ee0cad23/');

	let streetsURL = await page.$$eval('.search-item-text', (elements) => {
		return elements.map(elem => elem.getAttribute('href'));
	});
	
	for (let i = 0; i <= streetsURL.length - 1; i++) {

		let iterElem = streetsURL[i]; 
		console.log(`Переход на страницу ${iterElem}`);
		
		if (typeof iterElem === 'string') {
			await page.goto(baseURL.concat(iterElem), {waitUntil: 'domcontentloaded'});
		}

		// Получить название улицы
		let street = await page.$eval('#infoHolder > table > tbody > tr:nth-child(1) > td:nth-child(2)', elem => elem.innerText)
		console.log(`Улица ${street}`);
		
		// Получить массив зданий
		let houses = await page.$$eval('.search-item-text', (elements) => {
			return elements.map(elem => elem.innerHTML);
		});

		// Добавить улицу к зданиям
		const housesWithStreet = houses.map((house) => {
			let str = house;
			return house.replace(str, '').concat(street, ',', str);
		});

		housesWithStreet.forEach((elem) => {
			arr.push(elem);
		});
	}

	console.log('Конец');

	const filePath = join(__dirname, 'data.txt');
	arr.forEach(async (elem) => {
		await promises.appendFile(filePath, elem + '\n');
	});

		
	await brower.close();

})();