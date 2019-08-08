#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Aug  7 14:21:51 2019

@author: Fancois Dupont
"""
import tkinter as tk
import tkinter.font

class BinaryTreeTk(tk.Tk):

    def __init__(self, parent):
        tk.Tk.__init__(self, parent)
        self.parent = parent
        self.initialize()
        
    def initialize(self):
        self.geometry("%dx%d%+d%+d" % (800,370,150,100))
        self.canvas = tk.Canvas(self, width=792, height = 320, bg = 'snow2')
        self.canvas.pack()
        self.node_position = self.calculate_node_position()
        self.eteindre = tk.Button(self, text="Une action", command=self.action)
        self.eteindre.pack()
        self.tree = Tree(self.canvas, 0)
        self.import_from_list([2, 1, 3, 4, 5, None, 6, None, None, 7, 8, None, None, 9, None, None, None, None, None, 10, None, 11, 12,  None, None, None, None, 13, 14])
        self.tree.draw_tree(self.tree)
        
    def action(self):
        #self.tree.draw_tree(self.tree)
        self.canvas.itemconfigure(self.tree.left.right.circle, fill="red")
        self.canvas.itemconfigure(self.tree.left.link_left, fill="red")
    
    def import_from_list(self, List, index = 0):
        if len(List) > 0:
            if index == 0:
                self.tree.value = List[0]
                self.tree.index = index
                self.tree.x, self.tree.y = self.node_position[index][0], self.node_position[index][1]
            fg = fd = None 
            if 2*index+1 < len(List):
                fg = self.import_from_list(List, 2*index+1)
                if 2*index+2 < len(List):    
                    fd = self.import_from_list(List, 2*index+2)
            if index == 0:
                self.tree.left = fg
                self.tree.right = fd
            if List[index]!=None:
                return Tree(self.canvas, List[index], fg ,fd, index, 
                            self.node_position[index][0], 
                            self.node_position[index][1])
            else:
                return None    
        
    def calculate_node_position(self):
        node_position = []
        for l in range(5):
            decX = round(int(self.canvas['width'])/(2**(l+1)));
            x = decX
            y = 20+l*50
            for n in range(1,2**l+1):
                node_position.append([10+x, y]);
                x += 2*decX
        return node_position
    
class Tree(tk.Canvas):
    
    def __init__(self, canvas, value, left = None, right = None, index = None, 
                 x = None, y = None):
        self.canvas = canvas
        self.value = value
        self.left = left
        self.right = right
        self.index = index
        self.x, self.y = x, y
        self.radius = 12
    
    def draw_tree(self, tree):
        # parcours de l'arbre en profondeur pour tracer les liens et mettre
        # les noeuds dans une liste pour les dessiner à posteriori (par-dessus)
        #fils gauche ?
        if tree.left:
            # on dessine le sous-arbre gauche
            self.draw_tree(tree.left)
            # on dessine le lien entre l'arbre et son fils
            tree.link_left = self.canvas.create_line(tree.x, tree.y, tree.left.x, tree.left.y,
                        width = 2)
        #fils droit ?
        if tree.right:
            self.draw_tree(tree.right)
            tree.link_right = self.canvas.create_line(tree.x, tree.y, tree.right.x, tree.right.y,
                width = 2)
        if tree.index == 0:
            tree.draw_node()
        if tree.left:
            tree.left.draw_node()
        if tree.right:
            tree.right.draw_node()
                
    def draw_node(self):
        # Création de polices
        font_value = tkinter.font.Font(family='Helvetica', size=10, weight='bold')
        self.circle = self.canvas.create_oval(self.x-self.radius, self.y-self.radius, 
                                self.x+self.radius, self.y+self.radius, fill="silver", width=2)
        self.text = self.canvas.create_text(self.x, self.y, text=self.value, font=font_value)
        print(self.circle)
        

bt = BinaryTreeTk(None)
bt.mainloop()
