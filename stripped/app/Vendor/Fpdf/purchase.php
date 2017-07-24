<?

    class PDF extends FPDF{
        var $B;
        var $I;
        var $U;
        var $HREF;

   function PDF($orientation='P', $unit='mm', $size='A4',$user_id=null)
    {
        // Call parent constructor
        $this->FPDF($orientation,$unit,$size);
        // Initialization
        $this->B = 0;
        $this->I = 0;
        $this->U = 0;
        $this->HREF = '';
        $this->user_id = $user_id;
    }

   function WriteHTML($html)
    {
        // HTML parser
        $html = str_replace("\n",' ',$html);
        $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
        foreach($a as $i=>$e)
        {
            if($i%2==0)
            {
                // Text
                if($this->HREF)
                    $this->PutLink($this->HREF,$e);
                else
                    $this->Write(5,$e);
            }
            else
            {
                // Tag
                if($e[0]=='/')
                    $this->CloseTag(strtoupper(substr($e,1)));
                else
                {
                    // Extract attributes
                    $a2 = explode(' ',$e);
                    $tag = strtoupper(array_shift($a2));
                    $attr = array();
                    foreach($a2 as $v)
                    {
                        if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                            $attr[strtoupper($a3[1])] = $a3[2];
                    }
                    $this->OpenTag($tag,$attr);
                }
            }
        }
    }

   function OpenTag($tag, $attr)
    {
        // Opening tag
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,true);
        if($tag=='A')
            $this->HREF = $attr['HREF'];
        if($tag=='BR')
            $this->Ln(5);
    }

   function CloseTag($tag)
    {
        // Closing tag
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,false);
        if($tag=='A')
            $this->HREF = '';
    }

   function SetStyle($tag, $enable)
    {
        // Modify style and select corresponding font
        $this->$tag += ($enable ? 1 : -1);
        $style = '';
        foreach(array('B', 'I', 'U') as $s)
        {
            if($this->$s>0)
                $style .= $s;
        }
        $this->SetFont('',$style);
    }

   function PutLink($URL, $txt)
    {
        // Put a hyperlink
        $this->SetTextColor(0,0,255);
        $this->SetStyle('U',true);
        $this->Write(5,$txt,$URL);
        $this->SetStyle('U',false);
        $this->SetTextColor(0);
    }


    //Cell with horizontal scaling if text is too wide
           function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
            {
                    //Get string width
                    $str_width=$this->GetStringWidth($txt);

                    //Calculate ratio to fit cell
                    if($w==0)
                            $w = $this->w-$this->rMargin-$this->x;
                    $ratio = ($w-$this->cMargin*2)/$str_width;

                    $fit = ($ratio < 1 || ($ratio > 1 && $force));
                    if ($fit)
                    {
                            if ($scale)
                            {
                                    //Calculate horizontal scaling
                                    $horiz_scale=$ratio*100.0;
                                    //Set horizontal scaling
                                    $this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
                            }
                            else
                            {
                                    //Calculate character spacing in points
                                    $char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
                                    //Set character spacing
                                    $this->_out(sprintf('BT %.2F Tc ET',$char_space));
                            }
                            //Override user alignment (since text will fill up cell)
                            $align='';
                    }

                    //Pass on to Cell method
                    $this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

                    //Reset character spacing/horizontal scaling
                    if ($fit)
                            $this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
            }

            //Cell with horizontal scaling only if necessary
            function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
            {
                    $this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
            }

            //Cell with horizontal scaling always
            function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
            {
                    $this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
            }

            //Cell with character spacing only if necessary
            function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
            {
                    $this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
            }

            //Cell with character spacing always
            function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
            {
                    //Same as calling CellFit directly
                    $this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
            }

            //Patch to also work with CJK double-byte text
            function MBGetStringLength($s)
            {
                    if($this->CurrentFont['type']=='Type0')
                    {
                            $len = 0;
                            $nbbytes = strlen($s);
                            for ($i = 0; $i < $nbbytes; $i++)
                            {
                                    if (ord($s[$i])<128)
                                            $len++;
                                    else
                                    {
                                            $len++;
                                            $i++;
                                    }
                            }
                            return $len;
                    }
                    else
                            return strlen($s);
            }





    //  Code for creating pdf

    // Page header
    function Header()
    {
            
             if($this->PageNo() == 1){
             // Arial bold 15
                    $this->SetFont('Arial','B',12);

                    $this->Cell(0,5,'Presidential   Realty',0,1,'C');
                    $this->SetFont('Arial','',8);
                    $this->Cell(0,5,'Page '.$this->PageNo().' of {nb}',0,1,'R');
                    $this->SetFont('Arial','B',15);
                    $this->Cell(0,1,'RESIDENTIAL RESALE REAL ESTATE',0,1,'L');
                    $this->SetFont('Arial','B',27);
                    $this->Cell(100,12,'PURCHASE CONTRACT',0,0,'L');
                    $this->SetFont('Arial','',10);
                    $this->SetX(170);
                    $this->Cell(0,4,'Document updated:','L',0,'');
                    $this->Ln();
                    $this->SetX(170);
                    $this->SetFont('Arial','B',10);
                    $this->Cell(0,8,'February 2011','L',1,'C');

                    $this->Cell(50,28,$this->Image('images/pdf_images/arizona_left.png',10, $this->GetY()+4,50,20),'1',0,'C');
                    $this->SetFont('Arial','B',9);

                    $this->MultiCell(110,4,"The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®.Any change in the pre-printed language of this form must be made in a prominent manner.No representations are made as to the legal validity, adequacy and/or effects of any provision,including tax consequences thereof. If you desire legal, tax or other professional advice, pleaseconsult your attorney, tax advisor or professional consultant.",'1','L');
                    $this->SetY(33);
                    $this->SetX(170);
                    $this->Cell(30,28,$this->Image('images/pdf_images//arizona_right.png',172, $this->GetY()+6,25,0),'1',0,'C');
        }

            if($this->PageNo() != 1){	
                    $this->SetFont('Arial','B',12);
                    $this->Cell(50,5,'Residential Resale Real Estate Purchase Contract >>',0,0,'L');
                    $this->SetFont('Arial','',8);
                    $this->Cell(0,5,'Page '.$this->PageNo().' of {nb}',0,1,'R');
                    $this->Cell(0,0,'','B',1,'');
            }

    }

    // Page footer
        function Footer(){
            
            if($this->PageNo() != 9){
                $str1=utf8_decode("Copyright © 2011 Arizona Association of REALTORS® . All rights reserved.");
                $str2=utf8_decode("Produced with zipForm® by zipLogix 18070 Fifteen Mile Road, Fraser, Michigan 48026");

                $this->SetY(-40);
                $this->Image('images/pdf_images//next_page_ruller.png',$this->GetX(),$this->GetY(),195,0);

                $this->SetY(-37);
                $this->SetFont('Arial','',7);
                $this->Cell(180,5,'Residential Resale Real Estate Purchase Contract . Updated: February 2011',0,1,'C');
                $this->SetY(-33);
                $this->SetFont('Arial','',6);
                $this->Cell(180,5,$str1,0,1,'C');

                $this->SetY(-30);
                $this->Cell(18,5,'',1,0,'C');
                $this->Cell(18,5,'',1,0,'C');
                $this->SetFont('Arial','B',8);
                $this->Cell(50,5,'<Initials','B',0,'L');
                $this->Cell(55,5,'Initials>','B',0,'R');
                $this->Cell(18,5,$this->Image("images/pdf_images/".$this->user_id."_initial.png",$this->GetX()+2,$this->GetY()-3,'15','10'),1,0,'C');
                $this->Cell(18,5,'',1,0,'C');
                $this->Image('images/pdf_images//footer_qr_code.png',$this->GetX()+3,$this->GetY(),15,0);
                $this->Ln();
                $this->SetFont('Arial','',8);
                $this->Cell(18,5,'SELLER',1,0,'C');
                $this->Cell(18,5,'SELLER',1,0,'C');
                $this->Cell(105,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
                $this->Cell(18,5,'BUYER',1,0,'C');
                $this->Cell(18,5,'BUYER',1,0,'C');
                $this->Ln();

                $this->SetY(-15);
                $this->SetX(35);
                $this->SetFont('Arial','',6);
                $this->Cell(70,5,$str2,0,0,'C');
                $this->SetX($this->GetX()+10);
                $this->SetFont('Arial','U',6);
                $this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
                $this->SetFont('Arial','',8);
                $this->Cell(60,5,'Blank Listing',0,0,'R');
            }
            if($this->PageNo() == 9){
                $str1=utf8_decode("Copyright © 2011 Arizona Association of REALTORS® . All rights reserved.");
                $str2=utf8_decode("Produced with zipForm® by zipLogix 18070 Fifteen Mile Road, Fraser, Michigan 48026");

                $this->SetY(-40);
                $this->Image('images/pdf_images//next_page_ruller.png',$this->GetX(),$this->GetY(),195,0);

                $this->SetY(-37);
                $this->SetFont('Arial','',7);
                $this->Cell(180,5,'Residential Resale Real Estate Purchase Contract . Updated: February 2011',0,1,'C');
                $this->SetY(-33);
                $this->SetFont('Arial','',6);
                $this->Cell(180,5,$str1,0,1,'C');

                $this->SetY(-30);

                $this->SetX(187);
                $this->Image('images/pdf_images/footer_qr_code.png',$this->GetX()+3,$this->GetY(),15,0);
                $this->Ln();
                $this->Line(10,$this->GetY(),186,$this->GetY());
                $this->SetFont('Arial','',8);

                $this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');

                $this->Ln();

                $this->SetY(-15);
                $this->SetX(35);
                $this->SetFont('Arial','',6);
                $this->Cell(70,5,$str2,0,0,'C');
                $this->SetX($this->GetX()+10);
                $this->SetFont('Arial','U',6);
                $this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
                $this->SetFont('Arial','',8);
                $this->Cell(60,5,'Blank Listing',0,0,'R');
            }

        }

}//end class extension

?>