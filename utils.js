import { exec } from 'child_process'

const execute = (command, options = {}) => {
    return new Promise((resolve,reject) => {
        exec(command, options, function(error, stdout, stderr){
            if (error || stderr) {
               reject(error);
               return;
            }
            resolve(stdout);
        });
    })
};

export const getCommitDiff = async (commitId) => {
    return await execute(`git show ${commitId}`);
}

const getLatestCommitId = async () => {
   return await execute('git rev-parse --short HEAD');
}


export const getLatestCommitDiff = async () => {
    const commitId = await getLatestCommitId();
    return getCommitDiff(commitId);
}

const getPostsPath = (data, reg) => {
    const rst = [];
    const iterator = data.matchAll(reg);
    for (let [,path] of iterator) {
        rst.push(path);
    }
    return rst;
}

export const getNewPostsPath = (data, filenameReg) => {
    const reg = new RegExp(`diff --git a\/${filenameReg} b\/(${filenameReg})\nnew file`, 'g');
    return getPostsPath(data, reg);
}


export const getUpdatePostsPath = async (data, filenameReg) => {
    const reg = new RegExp(`diff --git a\/${filenameReg} b\/(${filenameReg})\nindex`, 'g');
    return getPostsPath(data, reg);
}
