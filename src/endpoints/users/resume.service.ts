import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumeService {
  generateResume(userData: any): string {
    const fileName = `resume_${userData.firstName}_${userData.lastName}.pdf`;
    // Assuming the public directory is in the root of your project
    const publicDir = path.join(__dirname, '../../public'); 
    const filePath = path.join(publicDir, fileName);

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(20).text(`${userData.firstName} ${userData.lastName}`, { align: 'center' });
    doc.fontSize(12).text(`${userData.email} | ${userData.phoneNumber} | ${userData.address}`, { align: 'center' });
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('About Me', { underline: true });
    doc.fontSize(12).text(userData.aboutMe);
    doc.moveDown();

    // Skills
    doc.fontSize(14).text('Skills', { underline: true });
    userData.skills.forEach(skill => {
      doc.fontSize(12).text(`• ${skill.name}`);
    });
    doc.moveDown();

    // Experience
    doc.fontSize(14).text('Experience', { underline: true });
    userData.experiences.forEach(exp => {
      doc.fontSize(12).text(`${exp.name} - ${exp.year} years`);
    });

    doc.end();
    return filePath;
  }
}
