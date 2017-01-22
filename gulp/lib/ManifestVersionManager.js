module.exports =  class MenifestVersionManager {
  constructor(versionType, version) {
    this.versionType = versionType;
    this.version = version;
  }

  update() {
    let v = this.version.split('.');
    switch (this.versionType) {
      case 'major':
        v[0] = (v[0] - 0) + 1;
        v[1] = 0;
        v[2] = 0;
        break;
      case 'minor':
        v[1] = (v[1] - 0) + 1;
        v[2] = 0;
        break;
      case 'patch':
         v[2] = (v[2] - 0) + 1;
        break;
      default: break;
    }
    this.version = v.join('.');
    return this;
  }

  getVersion() { return this.version; }
};