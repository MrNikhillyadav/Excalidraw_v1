import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type : "rect";
    x : number,
    y : number,
    width : number,
    height : number,
} | {
    type : "circle";
    centerX : number,
    centerY : number,
    radius : number,
} | {
    type : "pencil",
    startX : number,
    startY : number,
    endX : number,
    endY : number
}

// Better approach 
export class Game {
    private clicked: boolean;
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private existingShapes : Shape[];
    private roomId : string;
    private startX = 0;
    private startY = 0;
    private selectedTool : Tool = "circle";
    
    socket : WebSocket;

    constructor(canvas:HTMLCanvasElement, roomId:string, socket: WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.existingShapes = [];
        this.init();
        this.initHandlers();
        this.initMouseHanlders();

    }

    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHanlder)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHanlder)
    }

    setTool(tool : "circle" | "pencil" | "rect" ){
        this.selectedTool = tool;
    }

    async init(){
        this.existingShapes = await getExistingShapes(this.roomId); 
        this.renderCanvas();
    }

    initHandlers(){
         this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type == "chat")
                var parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape)
                this.renderCanvas();  
        }
    }

    renderCanvas(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0,0,0)'; //black

        this.existingShapes.map((shape) => {
            if(shape.type == "rect"){
                this.ctx.strokeStyle = 'rgba(255,255,255)'; // white
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height); // dimensions
            }else if( shape.type == "circle"){
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, 2 * Math.PI)
                this.ctx.stroke();
                this.ctx.closePath()
    ;        }
        })
    }

    mouseDownHandler(e:any){
        this.clicked= true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHanlder(e:any){
            if(this.clicked){
                const width = e.clientX - this.startX;
                const height = e.clientY - this.startY;
            
                const selectedTool = this.selectedTool;
                let shape: Shape | null = null;

                if(selectedTool == 'rect'){
                      shape = {
                        type: "rect",
                        x: this.startX,
                        y: this.startY,
                        height,
                        width
                    }
                }else if(selectedTool == "circle"){
                    const radius = Math.max(width,height)/2;
                    shape = {
                        type : "circle",
                        radius : radius,
                        centerX: this.startX + radius,
                        centerY: this.startY + radius,
                    }
                }

                if(!shape){
                    return;
                } 

                this.existingShapes.push(shape)

                this.socket.send(JSON.stringify({
                    type : "chat",
                    message : JSON.stringify({
                        shape
                    }),
                    roomId: this.roomId
                }))
            }
    }

    mouseMoveHanlder(e:any){
         if(this.clicked){
                const width = e.clientX - this.startX;
                const height = e.clientY - this.startY;
                this.renderCanvas();
                this.ctx.strokeStyle = "rgba(255,255,255)"

                const selectedTool = this.selectedTool;

                if(selectedTool == 'rect'){
                    this.ctx.strokeRect(this.startX, this.startY, width,height)
                }
                else if (selectedTool == "circle"){
                   const radius = Math.max(width, height)/2;
                   const centerX = radius + this.startX;
                   const centerY = radius + this.startY;

                   this.ctx.beginPath();
                   this.ctx.arc(centerX,centerY,radius,0, 2* Math.PI);
                   this.ctx.stroke();
                   this.ctx.closePath()
                }
            }
    }

    initMouseHanlders(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHanlder)
        this.canvas.addEventListener("mousemove", this.mouseMoveHanlder)
    }

}   