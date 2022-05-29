/**
 * 
 * 项目模版仓库地址集合
 * 
 */
const templates = [
    {
        name: 'server:spring-boot',
        description: 'Java应用服务(基于Spring Boot)',
        id: 'server-java',
        type: 'server',
        url: 'direct:https://gitee.com/simple-core/service-java-template.git',
        templateRootPath: '/server/java/module',
        sourcePath: './src/main/java',
        modelsPath: './model',
    },
    {
        name: 'mini-program:taro',
        description: '小程序(基于Taro)',
        id: 'mini-taro',
        type: 'mini',
        url: 'direct:https://gitee.com/simple-core/mini-taro-template.git',
        frameworkName: 'simple-framework-mini',
        componentsSrcPath:'src/pages/components',
        templateRootPath: '/frontend/mini',
        sourcePath: './src',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web-admin:antd-pro',
        description: '后台管理网站(基于Ant Desigin Pro)',
        id: 'web-antd-pro',
        type: 'web',
        url: 'direct:https://gitee.com/simple-core/web-antd-template.git',
        frameworkName: 'simple-framework',
        templateRootPath: 'web-admin',
        componentsSrcPath:'src/pages/components',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web:antd-pro',
        description: 'Web网站(基于Ant Desigin Pro)',
        id: 'web-antd-pro',
        type: 'web',
        url: 'direct:https://gitee.com/simple-core/web-antd-template.git',
        frameworkName: 'simple-framework',
        componentsSrcPath:'src/pages/components',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
   
    
    {
        name: 'web:nextjs',
        description: 'Web(PC/H5)网站(基于Next.JS)',
        id: 'web-nextjs',
        type: 'web',
        url: 'direct:https://gitee.com/simple-core/web-nextjs-template.git',
        frameworkName: 'simple-framework',
        componentsSrcPath:'components',
        templateRootPath: '/frontend/nextjs',
        modelsPath: './src/models',
        pagesPath: './src/pages'
    },
    {
        name: 'web:reactjs',
        description: 'Web(PC/H5)网站(基于React.JS简单框架)',
        id: 'web-reactjs',
        type: 'web',
        url: 'direct:https://gitee.com/simple-core/web-reactjs-template.git',
        frameworkName: 'simple-framework',
        componentsSrcPath:'src/components',
        templateRootPath: '/frontend/reactjs',
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
        url: 'direct:https://github.com/simple-creation/simple-framework.git#main',
        componentsSrcPath: './src/components',
        UICreatorBuildPath:'./',
        webPath: '/examples/build'
    },  
    {
        name: 'simple-framework-mini',
        url: 'direct:https://github.com/simple-creation/simple-framework-mini.git#main',
        componentsSrcPath: './src/components',
        UICreatorBuildPath:'/examples',
        webPath: '/examples/dist/h5'
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

