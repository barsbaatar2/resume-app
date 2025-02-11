import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumeService {
  generateResume(userData: any): string {
    const fileName = `resume_${userData.id}_${userData.firstName}_${userData.lastName}.pdf`;
    const publicDir = path.join(__dirname, '../../public');
    const filePath = path.join(publicDir, fileName);

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Define avatar size and positioning
    const avatarSize = 80;
    const avatarXPosition = (doc.page.width - avatarSize) / 2; // Centering horizontally
    const avatarYPosition = 50; // A bit of space from the top

    // Add Profile Image aligned at the top center
    if (userData.avatar) {
      const avatarData = userData.avatar.replace(/^data:image\/\w+;base64,/, '');
      doc.image(Buffer.from(avatarData, 'base64'), avatarXPosition, avatarYPosition, { width: avatarSize, height: avatarSize });
    }

    // Start the header text below the avatar
    const textYPosition = avatarYPosition + avatarSize + 10; // 10 is the spacing from the avatar
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    // Add Name and Contact Info in the center aligned
    doc.fontSize(20).text(`${userData.firstName} ${userData.lastName}`, { align: 'center' });
    doc.fontSize(12).text(`${userData.email} | ${userData.phoneNumber}`, { align: 'center' });
    doc.fontSize(12).text(`${userData.address}`, { align: 'center' });
    doc.moveDown();

    // About Me section
    doc.fontSize(14).text('About Me', { underline: true });
    doc.fontSize(12).text(userData.aboutMe || 'No information provided');
    doc.moveDown();

    // Job Positions Section
    doc.fontSize(14).text('Job Positions', { underline: true });
    doc.fontSize(12).text(`Primary Job: ${userData.primaryJob || 'Not specified'}`);
    doc.fontSize(12).text(`Secondary Job: ${userData.secondaryJob || 'Not specified'}`);
    doc.moveDown();

    // Work Details Section
    doc.fontSize(14).text('Work Details', { underline: true });
    doc.fontSize(12).text(`Work Mode: ${userData.workMode || 'Not specified'}`);
    doc.fontSize(12).text(`Work Type: ${userData.workType || 'Not specified'}`);
    doc.fontSize(12).text(`Work Commitment: ${userData.workCommitment || 'Not specified'}`);
    doc.fontSize(12).text(`Rate: ${userData.rateValue ? `₮${userData.rateValue} / ${userData.rateType || 'hourly'}` : 'Not specified'}`);
    doc.moveDown();

    // Skills Section
    doc.fontSize(14).text('Skills', { underline: true });
    userData.skills.forEach(skill => {
      doc.fontSize(12).text(`• ${skill.name}`);
    });
    doc.moveDown();

    // Experience Section
    doc.fontSize(14).text('Experience', { underline: true });
    userData.experiences.forEach(exp => {
      doc.fontSize(12).text(`${exp.name} - ${exp.year} years`);
    });

    doc.end();
    return filePath;
  }
}
