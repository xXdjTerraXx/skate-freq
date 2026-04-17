import * as THREE from 'three'

export default class AssetManager{
    constructor(assetManifest){
        this.assetManifest = assetManifest
        this.loader = new THREE.TextureLoader()

        this.loadedAssets = {}
    }

    getAsset = (bundle, asset) => {
        return this.loadedAssets[bundle][asset]
    }

    loadAsset = (path) => {
        return new Promise((resolve, reject) => {
            this.loader.load(
            path,
            (texture) => resolve(texture),
            undefined,
            (error) => {
                console.error("FAILED TO LOAD:", path)
                reject(error)
            }
            )
        })
    }

    loadAllAssets = async () => {
        console.log('loading assets...')
        for(let bundle in this.assetManifest){
            this.loadedAssets[bundle] = {}
            console.log("BUNDLE:", bundle)
            console.log("BUNDLE CONTENT:", this.assetManifest[bundle])
            for (let asset in this.assetManifest[bundle]){
                this.loadedAssets[bundle][asset] = await this.loadAsset(this.assetManifest[bundle][asset])
                console.log(`Loaded ${bundle}/${asset}`)
            }
        }
        console.log('assets loaded! here they are: ', this.loadedAssets)
    }
}