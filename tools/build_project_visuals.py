"""Build the portfolio's SVG project diagrams and charts from verified results.

Run from the repository root with Python 3. No third-party packages required.
Chart values and image provenance are documented in assets/PROJECT-MEDIA.md.
"""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1] / "assets"
BG = "#091827"
PANEL = "#102638"
LINE = "#294557"
TEXT = "#e7f2f1"
MUTED = "#9eb5c1"
MINT = "#8ce7c0"
PINK = "#f48cba"


def text(x, y, value, size=24, color=TEXT, weight=400, anchor="start", extra=""):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}" {extra}>{escape(str(value))}</text>'


def rect(x, y, w, h, fill=PANEL, radius=18, stroke=LINE):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>'


def path(d, color=MINT, width=3, extra=""):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'


def arrow(x1, y1, x2, y2, color=MINT):
    return path(f'M{x1} {y1}H{x2} M{x2-9} {y2-7}L{x2} {y2}L{x2-9} {y2+7}', color)


def svg(name, title, description, body, width=1200, height=675):
    content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>
<defs><radialGradient id="glow"><stop stop-color="#173d45"/><stop offset="1" stop-color="{BG}"/></radialGradient></defs>
<rect width="100%" height="100%" fill="{BG}"/>
<ellipse cx="900" cy="60" rx="600" ry="550" fill="url(#glow)" opacity=".65"/>
<g font-family="Segoe UI, Arial, sans-serif">{body}</g></svg>'''
    (ROOT / name).write_text(content, encoding="utf-8")


def label(value):
    return text(64, 73, value, 19, MINT, 600, extra='letter-spacing="3"')


def footer(value):
    return path('M64 585H1136', LINE, 1) + text(64, 627, value, 22, MUTED)


# A compact, factual comparison also serves as the crop project's header.
body = label("MODEL BENCHMARK")
body += text(64, 144, "Learning to read the leaves.", 44, TEXT, 600)
body += text(64, 190, "4 architectures · 12 crop conditions", 26, MUTED)
body += path('M119 466C106 327 159 254 328 248C337 386 253 474 119 466Z', MINT, 5)
body += path('M94 500L291 286 M153 439L155 347 M205 385L277 380 M239 351L239 296', MINT, 4)
body += rect(399, 246, 345, 278) + rect(768, 246, 368, 278)
body += text(433, 295, "MAIZE", 20, MUTED, 600) + text(802, 295, "CASHEW", 20, MUTED, 600)
body += text(433, 384, "85.89%", 62, PINK, 600) + text(802, 384, "95.73%", 62, MINT, 600)
body += text(433, 435, "test accuracy", 24, MUTED) + text(802, 435, "test accuracy", 24, MUTED)
body += text(433, 488, "EfficientNet-B0", 24) + text(802, 488, "EfficientNet-B0", 24)
body += footer("11,838 images · Held-out test sets · PyTorch")
svg("project-crop.svg", "Crop classification benchmark", "Illustrated leaf and verified EfficientNet-B0 test accuracy: 85.89% on maize and 95.73% on cashew.", body)

# Architecture diagrams are deliberately labeled as diagrams, not app screenshots.
body = label("SYSTEM ARCHITECTURE") + text(64, 144, "One command. Connected processes.", 44, TEXT, 600)
body += text(64, 190, "A TCP shell with Unix pipelines", 26, MUTED)
body += rect(64, 267, 295, 225) + rect(469, 267, 667, 225)
body += text(98, 314, "CLI CLIENT", 20, MUTED, 600)
body += text(98, 381, "$ ls | sort", 33, MINT, 600, extra='font-family="Consolas, monospace"')
body += text(98, 438, "input / output", 24, MUTED)
body += arrow(374, 363, 451, 363) + text(412, 334, "TCP", 18, MUTED, anchor="middle")
body += text(502, 314, "SHELL SERVER", 20, MUTED, 600)
body += rect(501, 342, 260, 75, "#173b3d", 12, "#2a5953") + rect(802, 342, 300, 75, "#302b43", 12, "#584059")
body += text(631, 389, "fork / exec", 31, MINT, 600, "middle") + text(952, 389, "Unix pipes", 31, PINK, 600, "middle")
body += arrow(771, 379, 790, 379) + text(502, 459, "Up to four command stages", 24, MUTED)
body += footer("C · POSIX · TCP sockets · Per-client working directory")
svg("project-shell.svg", "Networked shell architecture", "Architecture diagram: CLI client sends commands over TCP to a shell server using fork, exec and Unix pipes.", body)

body = label("PREDICTION PIPELINE") + text(64, 144, "From vehicle listings to price.", 44, TEXT, 600)
body += text(64, 190, "Cleaning, feature engineering and neural networks", 26, MUTED)
for x, title, top, bottom, color in [(64,"VEHICLE DATA","34,033","listings",MINT),(439,"PREPROCESSING","148","original features",TEXT),(814,"NEURAL NETWORK","64 → 32 → 16","hidden layers",PINK)]:
    body += rect(x, 273, 322, 244) + text(x+27, 318, title, 18, MUTED, 600)
    body += text(x+27, 407, top, 38 if x==814 else 57, color, 600) + text(x+27, 458, bottom, 23, MUTED)
body += arrow(399, 397, 425, 397) + arrow(774, 397, 800, 397)
body += footer("Clean measurements · Encode categories · Predict log-transformed price")
svg("project-car.svg", "Car price prediction pipeline", "Pipeline diagram showing 34,033 vehicle listings, 148 original features, preprocessing and a 64, 32, 16 neural-network architecture.", body)

body = label("APPLICATION WORKFLOW") + text(64, 144, "Track progress. Keep it in sync.", 44, TEXT, 600)
body += text(64, 190, "Separate user and administrator workflows", 26, MUTED)
body += rect(64, 260, 315, 265) + rect(443, 290, 315, 205) + rect(822, 260, 314, 265)
body += text(94, 308, "USER", 20, MINT, 600) + text(94, 368, "Log activities", 29, TEXT, 600)
body += text(94, 418, "Set goals", 27) + text(94, 470, "View progress", 27)
body += text(600, 338, "LOCAL STORAGE", 19, MUTED, 600, "middle")
body += text(600, 398, "data.txt", 37, MINT, 600, "middle", extra='font-family="Consolas, monospace"')
body += text(600, 450, "Persistent records", 23, MUTED, anchor="middle")
body += text(852, 308, "ADMINISTRATOR", 20, PINK, 600) + text(852, 368, "Review requests", 28, TEXT, 600)
body += text(852, 418, "Approve changes", 26) + text(852, 470, "Manage accounts", 26)
body += arrow(392, 389, 429, 389) + arrow(770, 389, 808, 389)
body += footer("Java Swing · User, Activity and Goal models · File-based persistence")
svg("project-fitness.svg", "Fitness tracker workflow", "Workflow diagram for the Java Swing fitness tracker: user activity and goals, local file storage, and administrator review.", body)

# Accuracy values are copied from the repository's Model Comparison table.
models = [("Custom CNN",70.91,90.03),("ResNet-18",80.60,95.63),("EfficientNet-B0",85.89,95.73),("VGG-16",67.63,90.03)]
body = label("HELD-OUT TEST RESULTS") + text(64, 130, "Model accuracy", 42, TEXT, 600)
body += text(64, 172, "Higher is better · All bars start at zero", 23, MUTED)
body += rect(803, 97, 19, 19, PINK, 4, PINK) + text(836, 115, "Maize", 22)
body += rect(952, 97, 19, 19, MINT, 4, MINT) + text(985, 115, "Cashew", 22)
start, scale = 294, 7.45
for v in range(0, 101, 25):
    x=start+v*scale
    body += path(f'M{x} 220V681', LINE, 1) + text(x, 712, f"{v}%", 19, MUTED, anchor="middle")
for i,(name,maize,cashew) in enumerate(models):
    y=231+i*111
    body += text(64, y+47, name, 23, TEXT, 600 if i==2 else 400)
    for offset,value,color in [(0,maize,PINK),(40,cashew,MINT)]:
        body += rect(start,y+offset,value*scale,29,color,6,color)
        body += text(start+value*scale+11,y+offset+23,f"{value:.2f}%",20,color,600)
body += text(64, 767, "EfficientNet-B0 achieved the highest test accuracy for both crops.", 23, MUTED)
svg("crop-model-accuracy-comparison.svg", "Crop model test accuracy", "Zero-based horizontal bars compare four architectures. EfficientNet-B0 leads with 85.89% maize accuracy and 95.73% cashew accuracy.", body, height=810)

matrices = {
    "maize": {
        "names": ["Fall armyworm","Grasshopper","Healthy","Leaf beetle","Leaf blight","Leaf spot","Streak virus"],
        "matrix": [[38,1,0,2,1,1,0],[1,96,1,2,0,0,1],[1,0,28,0,0,1,0],[4,1,1,133,0,1,0],[1,0,0,0,112,32,4],[0,0,9,1,29,142,5],[1,0,0,0,6,5,133]],
        "support": [43,101,30,140,149,186,145],
        "caption": "Most errors occur between leaf blight and leaf spot.",
    },
    "cashew": {
        "names": ["Anthracnose","Gumosis","Healthy","Leaf miner","Red rust"],
        "matrix": [[230,0,9,21,0],[0,58,1,0,0],[0,0,205,0,0],[3,1,1,199,2],[2,0,0,2,249]],
        "support": [260,59,205,206,253],
        "caption": "All 205 healthy leaves were correctly classified.",
    },
}


def blend(a,b,value):
    av=[int(a[i:i+2],16) for i in (1,3,5)]
    bv=[int(b[i:i+2],16) for i in (1,3,5)]
    return '#' + ''.join(f'{round(x+(y-x)*value):02x}' for x,y in zip(av,bv))


for crop,data in matrices.items():
    cm=data["matrix"]
    assert [sum(row) for row in cm]==data["support"]
    total=sum(data["support"])
    accuracy=100*sum(cm[i][i] for i in range(len(cm)))/total
    body=label("EFFICIENTNET-B0 / CLASS-LEVEL RESULTS")
    body+=text(64,130,f"{crop.title()} predictions",42,TEXT,600)
    body+=text(64,172,f"{total:,} test images · {accuracy:.2f}% accuracy · Each cell counts images",23,MUTED)
    n=len(cm); cell=84 if n==7 else 112; x0=278 if n==7 else 289; y0=244
    size=n*cell; maximum=max(max(r) for r in cm)
    for r,name in enumerate(data["names"]):
        body+=text(x0-20,y0+(r+.5)*cell+7,name,20,MUTED,anchor="end")
        for c,count in enumerate(cm[r]):
            amount=count/maximum
            base=MINT if r==c else PINK
            fill=blend(PANEL,base,0 if count==0 else .16+.84*amount)
            body+=rect(x0+c*cell,y0+r*cell,cell-5,cell-5,fill,7,BG)
            body+=text(x0+(c+.5)*cell-2,y0+(r+.5)*cell+7,count,23,BG if amount>.55 else TEXT,600 if r==c else 400,"middle")
    # Abbreviated column labels keep both charts compact and legible.
    column_names=["Armyworm","Grass|hopper","Healthy","Beetle","Blight","Spot","Virus"] if crop=="maize" else data["names"]
    for c,name in enumerate(column_names):
        for line_index,line in enumerate(name.split('|')):
            body+=text(x0+(c+.5)*cell-2,y0+size+26+line_index*18,line,16,MUTED,anchor="middle")
    body+=text(x0+size/2,y0+size+67,"PREDICTED CLASS",18,MUTED,600,"middle",extra='letter-spacing="2"')
    body+=text(64,219,"ACTUAL CLASS ↓",16,MUTED,600)
    legend_x=x0+size+33
    body+=rect(legend_x,y0+20,20,20,MINT,4,MINT)+text(legend_x+32,y0+37,"Correct",19,MUTED)
    body+=rect(legend_x,y0+58,20,20,PINK,4,PINK)+text(legend_x+32,y0+75,"Error",19,MUTED)
    body+=text(64,959,data["caption"],23,MUTED)
    svg(f"crop-efficientnet-{crop}-confusion-matrix.svg", f"EfficientNet-B0 {crop} confusion matrix", f"Verified image counts for {crop}, with actual classes in rows and predicted classes in columns. Mint marks correct predictions; pink marks errors.",body,height=1000)

print("Built four project diagrams and three crop charts.")
