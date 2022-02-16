/**
 * 
 * 项目模版仓库地址集合
 * 
 */
const templates = [
    {
        name: 'web:antd-pro',
        url: 'github.com:windwithlife/simpleaccountweb#main',
        frameworkName: 'simple-framework',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web(pc/h5):nextjs',
        url: 'github.com:windwithlife/SimpleWeb#main',
        frameworkName: 'simple-framework',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web:reactjs',
        url: 'github.com:simple-creation/simple-web#main',
        frameworkName: 'simple-framework',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web-admin:antd-pro',
        url: 'github.com:windwithlife/admin-web#main',
        frameworkName: 'simple-framework',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    
    {
        name: 'mini-program',
        url: 'github.com:windwithlife/simple-mini-program#master',
        frameworkName: 'simple-framework-mini',
        templateRootPath: '/frontend/mini',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'service:spring-boot',
        url: 'github.com:windwithlife/simplejavaserver#master',
        frameworkName: 'commonlib',
        templateRootPath: '/service/java',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
];

/**
 * 
 * 框架模版仓库地址集合
 * 
 */
 const frameworkTemplates = [
    {
        name: 'simple-framework',
        url: 'github.com:windwithlife/simple-framework#main',
        componentSrcPath: './src/components',
        UICreatorBuildPath:'./',
        webPath: '/examples/build'
    },  
    {
        name: 'simple-framework-mini',
        url: 'github.com:windwithlife/simple-framework-mini#main',
        componentSrcPath: './src/components',
        UICreatorBuildPath:'/examples',
        webPath: '/examples/dist/h5'
    },
    {
        name: 'commonlib',
        url: 'github.com:windwithlife/commonlib#master',
    },

];
const licenses = ["Academic Free License v3.0",
    "Apache license 2.0",
    "Artistic license 2.0",
    "Boost Software License 1.0",
    "BSD 2-clause 'Simplified' license",
    "BSD 3-clause 'New' or 'Revised' license",
    "BSD 3-clause Clear license",
    "Creative Commons license family",
    "Creative Commons Zero v1.0 Universal",
    "Creative Commons Attribution 4.0",
    "Creative Commons Attribution Share Alike 4.0",
    "Do What The F*ck You Want To Public License",
    "Educational Community License v2.0",
    "Eclipse Public License 1.0",
    "Eclipse Public License 2.0",
    "European Union Public License 1.1",
    "GNU Affero General Public License v3.0",
    "GNU General Public License family",
    "GNU General Public License v2.0",
    "GNU General Public License v3.0",
    "GNU Lesser General Public License family",
    "GNU Lesser General Public License v2.1",
    "GNU Lesser General Public License v3.0",
    "ISC",
    "LaTeX Project Public License v1.3c",
    "Microsoft Public License",
    "MIT",
    "Mozilla Public License 2.0",
    "Open Software License 3.0",
    "PostgreSQL License",
    "SIL Open Font License 1.1",
    "University of Illinois/NCSA Open Source License",
    "The Unlicense",
    "zLib License"];
exports.templates = templates;
exports.licenses = licenses;
exports.frameworkTemplates = frameworkTemplates;

