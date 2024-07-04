/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'cloudinary-react' {
    import { Component, ReactNode } from 'react';
  
    export interface CloudinaryContextProps {
      cloudName: string;
      children: ReactNode;
    }
  
    export class CloudinaryContext extends Component<CloudinaryContextProps> {}
  
    export interface ImageProps {
      publicId: string;
      width?: string | number;
      height?: string | number;
      crop?: 'scale' | 'fit' | 'limit' | 'mfit' | 'fill' | 'lfill' | 'pad' | 'lpad' | 'mpad' | 'crop' | 'thumb' | 'imagga_crop' | 'imagga_scale';
      alt?: string;
      title?: string;
      transformation?: object | Array<object>;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    }
  
    export class Image extends Component<ImageProps> {}
  
    export interface VideoProps extends Omit<ImageProps, 'crop'> {
      sources?: Array<{ type: string; codecs?: string; }>;
      fallback?: ReactNode;
      sourceTypes?: Array<string>;
      sourceTransformation?: Record<string, object>;
      [key: string]: any;
    }
  
    export class Video extends Component<VideoProps> {}
  
    export interface TransformationProps {
      [key: string]: string | number | boolean;
    }
  
    export class Transformation extends Component<TransformationProps> {}
  }