import { Selector } from 'testcafe';
import { Role } from 'testcafe';
import { ClientFunction } from 'testcafe';
import loginPage from './page-model';

const login = new loginPage();

const baseUrl = 'https://qa2019616300g.bspc.com';
const dailyPassword = 'CryPublicSale';

const instructorUser = Role(baseUrl + '/d2l/login', async t => {
	await t
		.typeText(login.userName, 'demo_i')
		.typeText(login.pwdField, dailyPassword)
		.click(login.loginButton);
});

// const getLatestSiteUrl = ClientFunction(() => {
// 	links = document.querySelectorAll('a');

//     for (i = 0; i < links.length; i++) {
//         if (links[i].text.includes('(Green)')) {
//             return links[i].href
//         }
//     }
// });

// fixture `setup`;

// test ('get latest qa site', async t => {
// 	await t
// 		.navigateTo('https://quad.build.d2l/QASites');
// 	const latestLink = getLatestSiteUrl();
// 	await t
// 		.expect(latestLink).eql('qa')
// });
// const d2lsupportUser = Role(baseUrl + '/d2l/login', async t => {
// 	await t
// 		.typeText(login.userName, 'd2lsupport')
// 		.typeText(login.pwdField, dailyPassword)
// 		.click(login.loginButton);
// });

// const mouseupOnDropdown = ClientFunction(() => {
// 	var event;
// 	event = document.createEvent('MouseEvents');
// 	event.initMouseEvent('mouseup',true,true,window);
// 	var openDropdownButton;
// 	openDropdownButton = document.querySelector('.d2l-datalist-item-content').querySelector('d2l-button-icon');
// 	openDropdownButton.dispatchEvent(event);
// });

// const clickOnMenuItem = ClientFunction(() => {
// 	var firstMenuItem =  document.querySelector('.d2l-datalist-item-content d2l-dropdown d2l-menu-item.d2l-menu-item-first');
// 	firstMenuItem.click();
// });

// const setToGotIt = ClientFunction(() => {
// 	document.querySelector('d2l-activity-alignments').shadowRoot.querySelector('d2l-user-alignment-list').shadowRoot.querySelector('d2l-alignment').shadowRoot.querySelector('d2l-outcomes-level-of-achievements').shadowRoot.querySelector('d2l-squishy-button#item-1').click();
// });

// const hasDefaultScale = ClientFunction(() => {
// 	var ulElement = document.querySelector('.d2l-datalist-container').children[2];
// 	if (ulElement.nodeName === 'UL' && ulElement.classList.contains('d2l-hidden')) {
// 		return false
// 	}
// 	return true
// });

// const conditionalTesting = (name, testToRun) => {
// 	// name = `${name}`
// 	test('navigate to page',async t => {
// 		await t
// 			.useRole(instructorUser)
// 			.navigateTo(`${baseUrl}/d2l/le/6606/loa/create`);
// 		const defaultScale = hasDefaultScale();
// 	});
	
// 	if (defaultScale) {
// 	  test(name, testToRun)
// 	} else {
// 	  test.skip(name, testToRun)
// 	}
//   }

fixture `Select`;

test ('test1', async t => {
	await t
		.navigateTo('http://127.0.0.1:8081/components/d2l-activity-alignments/demo/')
		.wait(3000);//because webcomponts don't do 'end events' correctly so we have to make sure it is loaded before we go looking for stuff in the shadowRoots
	const checkBox = Selector(() => {
		const alignment = document.querySelector('d2l-select-outcomes').shadowRoot.querySelector('d2l-alignment-update').shadowRoot
		return alignment.querySelector('d2l-input-checkbox').shadowRoot.querySelector('label > input[type="checkbox"]');
	});
	const addButton = await Selector(() => {
		const alignments = document.querySelector('d2l-select-outcomes').shadowRoot.querySelector('d2l-alignment-update').shadowRoot
		return alignments.querySelector('d2l-button')
	});
	await t
		.click(checkBox)
		.expect(addButton.hasAttribute('disabled')).notOk()
});

// fixture `Site Setup`;

// conditionalTesting('Add a Default Scale if necessary',async t => {
// 	await t
// 		.useRole(instructorUser)
// 		.navigateTo(`${baseUrl}/d2l/le/6606/loa/create`)
// 		.click(Selector('button').withText('Save and Close'));
// 	await mouseupOnDropdown();
// 	await clickOnMenuItem();
// 	await t
// 		.click(Selector('.d2l-button').withText('Set as default'));
// 	await t
// 		.expect(Selector('div.d2l-textblock.d2l-textblock-strong').textContent).eql('Default');
// });
// test 
// 	.before(async t =>{
// 		await t
// 			.useRole(instructorUser)
// 			.navigateTo(`${baseUrl}/d2l/le/6606/loa/create`);
// 	})
// 	('Add a Default Scale if necessary', async t => {
		
// 	// if (isScaleCreated) {

// 	// }
// 		await t
// 			.click(Selector('button').withText('Save and Close'));
// 		await mouseupOnDropdown();
// 		await clickOnMenuItem();
// 		await t
// 			.click(Selector('.d2l-button').withText('Set as default'));
// 		await t
// 			.expect(Selector('div.d2l-textblock.d2l-textblock-strong').textContent).eql('Default');
// });

// test ('Add an Intent List to the course', async t => {
// 	await t
// 		.resizeWindow(1400,950)
// 		.useRole(d2lsupportUser)
// 		.navigateTo(`${baseUrl}/d2l/le/lessons/131646/units/114126`);
// 	await t
// 		.switchToIframe(Selector('iframe'))
// 		.click(Selector('button.speedometer-btn'))
// 		.switchToMainWindow()
// 		.switchToIframe(Selector('iframe.d2l-dialog-frame'))
// 		.switchToIframe(Selector('iframe#iFrameResizer0'))
// 		.click('button.import-outcomes-button')
// 		.switchToMainWindow()
// 		.switchToIframe(Selector('iframe.d2l-dialog-frame').nth(1))
// 		.switchToIframe(Selector('iframe'))
// 	const jurisdictionSelect = Selector('#jurisdiction-dropdown')
// 	const accredidationOptions = jurisdictionSelect.find('option')
// 	await t
// 		.click(jurisdictionSelect)
// 		.click(accredidationOptions.withText("Accreditation"))
// 		.click(Selector('li').nth(0).find('span.fancytree-checkbox'))
// 		.click(Selector('button#picker_saveObjectivesButton'));
// });

// test ('Align An Outcome to Assignment', async t => {
// 	await t
// 		.useRole(instructorUser)
// 		.navigateTo(`${baseUrl}/d2l/lms/dropbox/admin/modify/folder_newedit_objectives.d2l?d2l_isfromtab=1&db=704&ou=131646`)
// 		.click(Selector('button').withText('Add Standards'))
// 		.switchToIframe(Selector('iframe.d2l-dialog-frame'))
// 		.wait(3000); //need a wait here b/c 'webcomponent completed' even doesn't mean it is fully loaded.
// 	await ClickOnFirstCheckboxAndAdd();
// });

// test ('assess outcome', async t => {
// 	await t
// 		.useRole(instructorUser)
// 		.navigateTo(`${baseUrl}/d2l/lms/dropbox/admin/mark/folder_submissions_users.d2l?db=704&ou=131646`)
// 		.click(Selector('span.ds_g').withText('Published'))
// 		.click(Selector('.di_t').withText('Standards')) //will not work if we change the lang term
// 		.wait(1000);
// 	await setToGotIt();
// });

// const firstMenuItem = await Selector('.d2l-datalist-item-content d2l-dropdown d2l-menu-item.d2l-menu-item-first');
// await t
	// .setNativeDialogHandler((type, text, url) => {
	// 	if (type === 'confirm') {
	// 		console.log('confirmed!')
	// 		return true
	// 	}
	// 	else {
	// 		console.log(type)
	// 		return true
	// 	}
	// })
	// .click(firstMenuItem)
	// .expect(firstMenuItem.id).eql('bob');

// const history = await t.getNativeDialogHistory();
// await t
// 	.expect(history).eql('hi')
	// .click(Selector('.d2l-button').withText('Set as default'))
	// .expect(firstMenuItem.exists).ok();
	// .setTestSpeed(0.1)
	// ;
	// 	.click(Selector('#optAddMaterial'));
// const docTile = Selector('div.material-tile-text').withText('Document');
// await t
// 	.click(docTile);
// await t
// 	.click(htmlDoc.docTitle)
// 	.typeText(htmlDoc.docTitle,'doc1');
// await t
// 	.click(htmlDoc.docBody);
// await t
// 	.click(htmlDoc.fullScreenButton);
// await t
// 	.click(htmlDoc.sourceEditor);
// await t
// 	.click(htmlDoc.textArea)
// 	.pressKey('ctrl+a backspace')
// 	.typeText(htmlDoc.textArea,'Nothing');
// const oldValue = htmlDoc.textArea.value;
// await t
// 	.click(Selector('span').withText('Ok'))
// 	.click('.button.button.primary.save')
// const dotDotButton = Selector('d2l-button').withAttribute('title','Options');
// await t
// 	// .expect(dotDotButton.exists).notOk()
// 	// .expect(dotDotButton.exists).ok()
// 	.click(dotDotButton)
// 	.click(Selector('#optEdit'));
// await t
// 	.click(htmlDoc.sourceEditor)
// 	.click(htmlDoc.textArea)
// 	.pressKey('ctrl+a ctrl+x ctrl+v');
// const newValue = htmlDoc.textArea.value;
// await t
// 	.expect(newValue).eql(oldValue);
	// .typeText(docBody,'<head>head stuff</head>')
	
	// .expect(Selector('input[type="text"]').exists).ok({ timeout: 10000 })
	// .typeText(login.userName, 'd2lsupport')
	// .typeText(login.pwdField, dailyPassword)
	// .click(login.loginButton);
//     .navigateTo(baseUrl+'/d2l/le/lessons/'+courseId)
//     .switchToIframe(Selector('iframe'));
// const buttons = await Selector('button');
// await t.expect(buttons.nth(1).innerText).eql('Course options');
// await t
//     .click(buttons.nth(1))
//     .click(Selector('#optAddUnit'))
//     .click('.button.button.primary.save');
// });

// test
//     .before( async t => {
//         await t
//             .useRole(instructorUser)
//             .navigateTo(baseUrl+'/d2l/le/lessons/'+courseId +'/'+)
//             .switchToIframe(Selector('iframe'));
//     })
//     ('Add a Lesson', async t => {
//     const buttons = await Selector('button');
//     await t.expect(buttons.nth(1).innerText).eql('Course options');
//     await t
//         .click(buttons.nth(1))
//         .click(Selector('#optAddUnit'))
//         .click('.button.button.primary.save');
// });
