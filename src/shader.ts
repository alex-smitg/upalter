import { gl } from "./context";


let fragmentSource: string =
    `#version 300 es
#pragma vscode_glsllint_stage : frag

precision mediump float;

in vec3 normal;
in vec2 textureCoordinates;
in vec3 cameraViewDirection;

uniform sampler2D diffuseTexture;

uniform vec3 dirLightDirection;
uniform vec3 dirLightColor;
uniform float dirLightStrength;

uniform bool lightEnabled;
uniform bool specularEnabled;

out vec4 fragColor;

void main() {
    vec3 color = texture(diffuseTexture, textureCoordinates).rgb;
    
    color *= 0.5; 
    color = pow(color, vec3(1.2));

    float dirLight = dot(normal, dirLightDirection);


    


    float nDot = dot(normal, dirLightDirection);
    vec3 reflectDir = reflect(dirLightDirection, normal);
    float spec = pow(max(dot(cameraViewDirection, -reflectDir), 0.0), 32.0);
    vec3 specular = dirLightColor * spec * nDot * 2.0;

    vec3 result = color;

    if (lightEnabled) {
        result *= dirLightColor * dirLight * dirLightStrength;
    }

    if (specularEnabled) {
        result += specular;
    }
    

    fragColor = vec4(result, 1.0);
}
`

let vertexSource: string =
    `#version 300 es
#pragma vscode_glsllint_stage : vert

in vec3 vertexPosition;
in vec3 vertexNormal;
in vec2 vertexTextureCoordinates;

out vec3 normal;
out vec2 textureCoordinates;
out vec3 cameraViewDirection;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;


void main() {
    mat3 normalMatrix = mat3(transpose(inverse(uModelMatrix)));

    mat4 inverseViewMatrix = inverse(uViewMatrix);
    cameraViewDirection = normalize(vec3(inverseViewMatrix[2]));

    normal = normalize(normalMatrix*vertexNormal);
    textureCoordinates = vertexTextureCoordinates;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *  vec4(vertexPosition, 1.0);
}
`

let vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
gl.shaderSource(vs, vertexSource)
gl.compileShader(vs)

let fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
gl.shaderSource(fs, fragmentSource)
gl.compileShader(fs)

let program = gl.createProgram() as WebGLProgram
gl.attachShader(program, vs)
gl.attachShader(program, fs)
gl.linkProgram(program)
gl.useProgram(program)

const uniforms: { [index: string]: WebGLUniformLocation | null } = {
    "uModelMatrix": gl.getUniformLocation(program, "uModelMatrix"),
    "uProjectionMatrix": gl.getUniformLocation(program, "uProjectionMatrix"),
    "uViewMatrix": gl.getUniformLocation(program, "uViewMatrix"),
    "diffuseTexture": gl.getUniformLocation(program, "diffuseTexture"),
    "dirLightDirection": gl.getUniformLocation(program, "dirLightDirection"),
    "dirLightColor": gl.getUniformLocation(program, "dirLightColor"),
    "dirLightStrength": gl.getUniformLocation(program, "dirLightStrength"),
    "lightEnabled": gl.getUniformLocation(program, "lightEnabled"),
    "specularEnabled": gl.getUniformLocation(program, "specularEnabled")
}

const attributes: { [index: string]: number | null } = {
    "vertexPosition": gl.getAttribLocation(program, "vertexPosition"),
    "vertexNormal": gl.getAttribLocation(program, "vertexNormal"),
    "vertexTextureCoordinates": gl.getAttribLocation(program, "vertexTextureCoordinates")
}

gl.uniform1i(gl.getUniformLocation(program, "diffuseTexture"), 0);

export { uniforms, attributes }