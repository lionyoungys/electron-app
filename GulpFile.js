var gulp = require('gulp');
var fs = require('fs');

var platform = 'win32';
var arch = 'ia32';
var appPath = 'app';
var outName = 'app-master-win32-' + arch;
var packageOutPath = 'production/package';
var installerOutPath = 'production/installer';
var packagePath = `${packageOutPath}/${outName}`;
var installerPath = `${installerOutPath}/${outName}`;
var iconPath = 'app/icon/icon.ico';
var gifPath = 'app/public/img/loading.gif';

gulp.task('generate-package', () => {
    generatePackage();
});
gulp.task('generate-installer', () => {
    isDirExist(packagePath, (exist) => {
        if (exist) {
            generateInstaller();
        } else {
            generatePackage(() => {
                generateInstaller();
            });
        }
    });
});

function isDirExist(path, callback) {
    fs.readdir(path, (err) => {
        callback && callback(!err);
    });
}

function generatePackage(callback) {
    var packager = require('electron-packager')
    packager({
        dir: appPath,
        platform: platform,
        arch: arch,
        out: packageOutPath,
        icon: iconPath,
        /*桌面快捷方式名称以及开始菜单文件夹名称*/
        'version-string': {
            CompanyName: 'MyCompany Inc.',
            ProductName: 'app-master'
        }
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback && callback();
        }
    });
}

function generateInstaller() {
    var electronInstaller = require('electron-winstaller');
    electronInstaller.createWindowsInstaller({
        appDirectory: packagePath,
        outputDirectory: installerPath,
        loadingGif: gifPath,
        authors: 'ganyouyin',
        exe: 'app-master.exe',
        title: 'My APP',
        iconUrl: `${__dirname}/${iconPath}`,
        setupIcon: iconPath,
        setupExe: 'Setup.exe',
        noMsi: true
    }).then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
}
