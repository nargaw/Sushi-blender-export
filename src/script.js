import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
const canvas = document.querySelector('.webgl')

class NewScene{
    constructor(){
        this._Init()
    }
    
    _Init(){
        this.scene = new THREE.Scene()
        this.InitTexture()
        this.InitText()
        this.InitCamera()
        this.InitLights()
        this.InitRenderer()
        this.InitControls()
        this.Update()
        window.addEventListener('resize', () => {
            this.Resize()
        })
    }

    InitTexture(){
        this.textureLoader = new THREE.TextureLoader()
        this.bakedTexture = this.textureLoader.load('bakedsushi.jpg')
        this.bakedTexture.flipY = false
        this.bakedTexture.encoding = THREE.sRGBEncoding
        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.load(
            'sushi.glb',
            (gltf) => 
            {
                gltf.scene.traverse((child) => {
                    child.material = this.bakedMatarial
                })
               this.scene.add(gltf.scene)
            }
        )
        this.bakedMatarial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
    }

    InitText(){
        this.fontLoader = new THREE.FontLoader()
        this.fontLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json',
            (font) => 
            {
                this.textGeometry = new THREE.TextGeometry(
                    'Sushi',
                    {
                        font: font,
                        size: 2.5,
                        height: 0.5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 5
                    }
                )
                this.textGeometry.computeBoundingBox()
                this.textGeometry.center()
                this.matcapTexture = this.textureLoader.load('matcap-porcelain-white.jpg')
                console.log(this.matcapTexture)
                this.textMaterial = new THREE.MeshMatcapMaterial({ matcap: this.matcapTexture})
                this.text = new THREE.Mesh(this.textGeometry, this.textMaterial)
                this.scene.add(this.text)
                this.text.position.set(7, 1.4, 0)
                this.text.rotation.y = -Math.PI * 0.5 
            }
        )
    }
    
    InitRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)
    }

    InitCamera(){
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
        this.camera.position.set(-12, 6, 0)
        this.scene.add(this.camera)
    }

    InitLights(){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(this.ambientLight)
    }

    InitControls(){
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
        this.controls.update()
    }

    Resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    Update(){
        requestAnimationFrame(() => {     
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
            this.Update()
        })  
    }
}

let _APP = null

window.addEventListener('DOMContentLoaded', () => {
    _APP = new NewScene()
})