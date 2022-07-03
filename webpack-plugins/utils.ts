import * as fs from 'fs';
import * as path from 'path';


export const DIST_FOLDER = 'dist';
export const SRC_FOLDER = './src';

const mailsPath = path.join('.', SRC_FOLDER, 'mails');

export const ASSETS = [
	'images'
];

export const getMails = (regex: any) => {
	const files: any = [];
	fs.readdirSync(mailsPath)
		.forEach((file) => {
			// obtain page absolute path, this is with the assumption
			// that the code structure will be mail > file
			// check if it's a directory
			const mailPath = path.join(mailsPath, file);
			const pageStat = fs.statSync(mailPath);
			const extension = path.extname(mailPath);
			const fileName = path.basename(mailPath, extension);

			if (pageStat.isFile() && file.match(regex)) {
				files.push({
					name: fileName,
					entry: mailPath,
				});
			}
		});

	return files;
}
