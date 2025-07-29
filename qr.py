import qrcode # library for qr code, pillow library for identify image

image = qrcode.make("http://127.0.0.1:8080") # the url where image being scan 

'''
Upper image is python object, make python ojbect into file
Once run the qr.py, scan the run qr code image on phone will run the link being provided
'''
image.save("qr.png") 
'''
After run the qr.py code, the website will show on your phone
'''