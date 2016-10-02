import { firebaseApp } from 'utils/firebase';
import { resourceBaseUrl } from 'actions/ConfigActions';

export const updateReadingRecord = ({comicID, chapterID}) => {
	let ref = firebaseApp.database().ref(`${resourceBaseUrl}/readingRecord/${comicID}`);
	ref.once('value').then(snapshot => {
		ref.update({...snapshot.val(), [chapterID]: new Date().getTime()});
	});
};

export const markNotificationSent = ({comicID, chapterID}) => {
	let ref = firebaseApp.database().ref(`${resourceBaseUrl}/readingRecord/${comicID}`);
	ref.once('value').then(snapshot => {
		ref.update({...snapshot.val(), [chapterID]: 'notification_sent'});
	});
};

export const replaceChapterCache = ({comicID, chapters}) => {
	let ref = firebaseApp.database().ref(`${resourceBaseUrl}/chapterCache/${comicID}`);
	ref.set(chapters);
};
