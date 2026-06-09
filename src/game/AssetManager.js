import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class AssetManager{
    constructor(assetManifest2D, assetManifest3D){
        this.manifestArray = [assetManifest2D, assetManifest3D]
        this.loader = new THREE.TextureLoader()
        this.loader3D = new GLTFLoader()

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

    loadAsset3D = async (path) => {
        return new Promise((resolve, reject) => {
            this.loader3D.load(
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

        //TO DO CHECK FOR 2D OR 3D ASSET
        //const is3D = path.endsWith('.glb') || path.endsWith('.gltf')
        /////////////////////////////////
        for(const manifest of this.manifestArray){
            for(let bundle in manifest){
                this.loadedAssets[bundle] = {}
                console.log("BUNDLE:", bundle)
                console.log("BUNDLE CONTENT:", manifest[bundle])
                for (let asset in manifest[bundle]){
                    const assetPath = manifest[bundle][asset]
                    const is3D = assetPath.endsWith('.glb') || assetPath.endsWith('.gltf')
                    if(!is3D) this.loadedAssets[bundle][asset] = await this.loadAsset(assetPath)
                    else this.loadedAssets[bundle][asset] = await this.loadAsset3D(assetPath)
                    
                    console.log(`Loaded ${bundle}/${asset}`)
                }
            }
        }
        console.log('assets loaded! here they are: ', this.loadedAssets)
    }
}